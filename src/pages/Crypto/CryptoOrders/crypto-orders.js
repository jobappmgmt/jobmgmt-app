import React, { Component } from "react"
import PropTypes from "prop-types"
import MetaTags from 'react-meta-tags';
import { map } from "lodash"
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap"
import classnames from "classnames"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Date Picker
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { MDBDataTable } from "mdbreact"
import "assets/scss/datatables.scss"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
import cryptoOrderColumn from "./cryptoOrderColumn"
import { getCryptoOrders } from "store/crypto/actions"

class CryptoOrders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: new Date(),
      activeTab: "1",
    }
  }

  componentDidMount() {
    const { onGetOrders } = this.props
    onGetOrders()
  }

  handleChange = date => {
    this.setState({
      startDate: date,
    })
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      })
    }
  }

  render() {
    const { orders } = this.props
    const status = {
      completed: (
        <span className="badge bg-success font-size-10">Completed</span>
      ),
      pending: (
        <span className="badge bg-warning font-size-10">Pending</span>
      ),
      failed: <span className="badge bg-danger font-size-10">Failed</span>,
    }
    const data = {
      columns: cryptoOrderColumn,
      rows: map(orders, order => ({ ...order, status: status[order.status] })),
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Orders | Skote - Responsive Bootstrap 5 Admin Dashboard</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs title="Crypto" breadcrumbItem="Orders" />

            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <h4 className="card-title mb-3">Orders</h4>

                    <ul className="nav nav-tabs nav-tabs-custom" role="tablist">
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "1",
                          })}
                          onClick={() => {
                            this.toggleTab("1")
                          }}
                        >
                          All Orders
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "2",
                          })}
                          onClick={() => {
                            this.toggleTab("2")
                          }}
                        >
                          Processing
                        </NavLink>
                      </NavItem>
                    </ul>

                    <TabContent
                      activeTab={this.state.activeTab}
                      className="p-3"
                    >
                      <TabPane tabId="1" id="all-order">
                        <Form>
                          <Row>
                            <Col sm="6" className="col-xl">
                              <FormGroup className="mt-3 mb-0">
                                <Label>Date :</Label>
                                <DatePicker
                                  selected={this.state.startDate}
                                  onChange={this.handleChange}
                                  className="form-control"
                                  placeholderText="Select date"
                                />
                              </FormGroup>
                            </Col>

                            <Col sm="6" className="col-xl">
                              <FormGroup className="mt-3 mb-0">
                                <Label>Coin</Label>
                                <select className="form-control select2-search-disable">
                                  <option value="BTC" defaultValue>
                                    Bitcoin
                                  </option>
                                  <option value="ETH">Ethereum</option>
                                  <option value="LTC">litecoin</option>
                                </select>
                              </FormGroup>
                            </Col>

                            <Col sm="6" className="col-xl">
                              <FormGroup className="mt-3 mb-0">
                                <Label>Type</Label>
                                <select className="form-control select2-search-disable">
                                  <option value="BU" defaultValue>
                                    Buy
                                  </option>
                                  <option value="SE">Sell</option>
                                </select>
                              </FormGroup>
                            </Col>

                            <Col sm="6" className="col-xl">
                              <FormGroup className="mt-3 mb-0">
                                <Label>Status</Label>
                                <select className="form-control select2-search-disable">
                                  <option value="CO" defaultValue>
                                    Completed
                                  </option>
                                  <option value="PE">Pending</option>
                                </select>
                              </FormGroup>
                            </Col>

                            <Col sm="6" className="col-xl align-self-end">
                              <div className="mt-3">
                                <Button
                                  type="button"
                                  color="primary"
                                  className="w-md"
                                >
                                  Add Order
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>

                        <MDBDataTable
                          responsive
                          bordered
                          data={data}
                          className="mt-5"
                        />
                      </TabPane>
                      <TabPane tabId="2" id="processing">
                        <div>
                          <MDBDataTable
                            responsive
                            bordered
                            data={data}
                            className="table table-hover datatable dt-responsive nowrap"
                            style={{ borderCollapse: "collapse", borderSpacing: "0", width: "100%" }}
                          />
                        </div>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    )
  }
}

CryptoOrders.propTypes = {
  orders: PropTypes.array,
  onGetOrders: PropTypes.func,
}

const mapStateToProps = ({ crypto }) => ({
  orders: crypto.orders,
})

const mapDispatchToProps = dispatch => ({
  onGetOrders: () => dispatch(getCryptoOrders()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CryptoOrders))
