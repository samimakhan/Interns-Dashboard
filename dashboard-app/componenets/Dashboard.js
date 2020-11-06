import React, { Component } from "react";
import "./dashboard.css";
import { Col, Row, Container } from "react-bootstrap";
import TextWidget from "./TextWidget";
import BarWidget from "./BarWidget";
import DougnutWidget from "./DougnutWidget";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import dashboard from "./images/dashboard.svg";
import socialdashboard from "./images/social_dashboard.svg";
import dataTrends from "./images/data_trends.svg";
import information from "./images/information.svg";

import Footer from "./Footer";

//excel import
const config = {
  apiKey: "AIzaSyDMu-Vw30ykPPmFT3cXeunzKEi4EahzglI",
  spreadsheetId: "1vcDPrMexD8bxNwwzK9IxF8wch6Hfezq2eooJACDiqgg",
};
const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      dropdownOptions: [],
      selectedValue: null,
      organicSource: null,
      directSource: null,
      referralSource: null,
      pageViews: null,
      sessions: null,
      avgSessionTime: null,
      bounceRate: null,
      users: null,
      newUsers: null,
      sourceArr: [],
      userArr: [],
    };
  }

  getData = (arg) => {
    const arr = this.state.items;
    const arrLen = arr.length;

    let organicSource = 0;
    let directSource = 0;
    let referralSource = 0;
    let pageViews = 0;
    let users = 0;
    let newUsers = 0;
    let sessions = 0;
    let avgSessionTime = 0;
    let bounceRate = 0;
    // let selectedValue = null;
    let sourceArr = [];
    let userArr = [];

    for (let i = 0; i < arrLen; i++) {
      if (arg === arr[i]["month"]) {
        organicSource = arr[i].organic_source;
        directSource = arr[i].direct_source;
        referralSource = arr[i].referral_source;
        pageViews = arr[i].page_views;
        sessions = arr[i].sessions;
        avgSessionTime = arr[i].avg_session_time;
        bounceRate = arr[i].bounce_rate;
        users = arr[i].users;
        newUsers = arr[i].new_users;
        sourceArr.push(
          {
            label: "Organic Source",
            value: arr[i].organic_source,
          },
          {
            label: "Direct Source",
            value: arr[i].direct_source,
          },
          {
            label: "Referral Source",
            value: arr[i].referral_source,
          }
        );
        userArr.push(
          {
            label: "Users",
            value: arr[i].users,
          },
          {
            label: "New Users",
            value: arr[i].new_users,
          }
        );
      }
    }

    // selectedValue = arg;

    this.setState({
      organicSource: organicSource,
      directSource: directSource,
      pageViews: pageViews,
      referralSource: referralSource,
      users: users,
      newUsers: newUsers,
      sourceArr: sourceArr,
      userArr: userArr,
      sessions: sessions,
      avgSessionTime: avgSessionTime,
      bounceRate: bounceRate,
    });
  };

  updateDashboard = (event) => {
    this.getData(event.value);
    this.setState({ selectedValue: event.value }, () => {
      console.log(this.state.organicSource);
    });
  };

  componentDidMount() {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let batchRowValues = data.valueRanges[0].values;

        const rows = [];

        for (let i = 1; i < batchRowValues.length; i++) {
          let rowObject = {};
          for (let j = 0; j < batchRowValues[i].length; j++) {
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          rows.push(rowObject);
        }
        // dropdown options
        let dropdownOptions = [];

        for (let i = 0; i < rows.length; i++) {
          dropdownOptions.push(rows[i].month);
        }

        dropdownOptions = Array.from(new Set(dropdownOptions)).reverse();
        this.setState(
          {
            items: rows,
            dropdownOptions: dropdownOptions,
            selectedValue: "Jan 2018",
          },
          () => this.getData(this.state.selectedValue)
        );
      });
  }
  render() {
    return (
      <div>
        <Container fluid>
          <Row className="TopHeader">
            <Col>Dashboard</Col>
            <Col>
              <Dropdown
                options={this.state.dropdownOptions}
                onChange={this.updateDashboard}
                value={this.state.selectedValue}
                placeholder="Select an option"
              />
            </Col>
          </Row>
          
        </Container>
        <Container className="mainDashboard">
          <Row>
            <Col>
              <TextWidget
                title="Organic Source"
                value={this.state.organicSource}
                // description="Hello"
              />
            </Col>
            <Col>
              <TextWidget
                title="Direct Source"
                value={this.state.directSource}
                // description="Hello"
              />
            </Col>
            <Col>
              <TextWidget
                title="Referral Source"
                value={this.state.referralSource}
                // description="Hello"
              />
            </Col>
            <Col>
              <TextWidget
                title="Page Views"
                value={this.state.pageViews}
                // description="Hello"
              />
            </Col>
          </Row>
          <Row>
            <Col className="users">
              <TextWidget
                title="Users"
                value={this.state.users}
                // description="Hello"
              />
            </Col>

            

            <Col className="sessions">
              <TextWidget
                title="Sessions"
                value={this.state.sessions}
                // description="Hello"
              />
            </Col>
          </Row>
          <Row>
            <Col className="avgsession">
              <TextWidget
                title="Average Session Time"
                value={this.state.avgSessionTime}
                // description="Hello"
              />
            </Col>
            <Col>
              <TextWidget
                title="New Users"
                value={this.state.newUsers}
                // description="Hello"
              />
            </Col>
            <Col className="bounceRate">
              <TextWidget
                title="Bounce Rate"
                value={this.state.bounceRate}
                // description="Hello"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <BarWidget title="Soure Comparison" data={this.state.sourceArr} />
            </Col>

            <Col className="dognut">
              <DougnutWidget
                title="Users Comparison"
                data={this.state.userArr}
              />
            </Col>
          </Row>
          
          <Row>
            <Col>
              <Footer />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
