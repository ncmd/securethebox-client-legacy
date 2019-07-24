import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions';
import {
    withStyles,
    Paper,
} from '@material-ui/core';
import { TrafficMap } from "react-network-diagrams";


const styles = theme => ({
    stepLabel: {
        cursor: 'pointer!important'
    },
    successFab: {
        background: 'red',
        color: 'white!important'
    }
});

const siteStyle = {
    node: {
        normal: {fill: "#B0B0B0", stroke: "#9E9E9E", cursor: "pointer"},
        selected: {fill: "#37B6D3", stroke: "rgba(55, 182, 211, 0.22)",
                   strokeWidth: 10, cursor: "pointer"},
        muted: {fill: "#B0B0B0", stroke: "#9E9E9E", opacity: 0.6,
                cursor: "pointer"}
    },
    label: {
        normal: {fill: "#696969", stroke: "none", fontSize: 20},
        selected: {fill: "#333", stroke: "none", fontSize: 20},
        muted: {fill: "#696969", stroke: "none", fontSize: 20,
                opacity: 0.6}
    }
};

const hubStyle = {
    node: {
        normal: {fill: "#CBCBCB",stroke: "#BEBEBE",
                 cursor: "pointer"},
        selected: {fill: "#37B6D3", stroke: "rgba(55, 182, 211, 0.22)",
                   strokeWidth: 10, cursor: "pointer"},
        muted: {fill: "#CBCBCB", stroke: "#BEBEBE", opacity: 0.6,
                cursor: "pointer"}
    },
    label: {
        normal: {fill: "#696969", stroke: "none", fontSize: 20},
        selected: {fill: "#333",stroke: "none", fontSize: 20},
        muted: {fill: "#696969", stroke: "none", fontSize: 20, opacity: 0.6}
    }
};

const nodeStyle = {
  node: {
      normal: {fill: "#CBCBCB",stroke: "#BEBEBE",
               cursor: "pointer"},
      selected: {fill: "#37B6D3", stroke: "rgba(55, 182, 211, 0.22)",
                 strokeWidth: 10, cursor: "pointer"},
      muted: {fill: "#CBCBCB", stroke: "#BEBEBE", opacity: 0.6,
              cursor: "pointer"}
  },
  label: {
      normal: {fill: "#696969", stroke: "none", fontSize: 20},
      selected: {fill: "#333",stroke: "none", fontSize: 20},
      muted: {fill: "#696969", stroke: "none", fontSize: 20, opacity: 0.6}
  }
};

// Mapping of node type to style
const stylesMap = {
    hub: hubStyle,
    esnet_site: siteStyle,
    node: nodeStyle
};

class CourseScenario extends Component {

    constructor(props) {
        super(props);
        this.state = {
            topology: {
              "name": "simple",
              "description": "Simple topo",
              "nodes": [
                {
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[attacker] - kali",
                  "type": "node",
                  "x": 16,
                  "y": 10,
                  "id": "6ccdfc0b-cb53-4d41-a732-bd2c45915b01"
                },
                {
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[defender]",
                  "site": 5,
                  "type": "node",
                  "x": 17,
                  "y": 59,
                  "id": "73f2ae11-0320-4024-bbbe-33b26a820412"
                },
                {
                  "id": "6e62cf17-9f66-495a-8d5b-e25f903a430a",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[indexer] - splunk-universal-forwarder",
                  "type": "node",
                  "x": 97,
                  "y": 106
                },
                {
                  "id": "ca35487f-f1ab-41b5-b400-51b8698a92b0",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[persistent-volume] - /var/log/challenge1",
                  "type": "node",
                  "x": 180,
                  "y": 106
                },
                {
                  "id": "aae302c0-1517-4fc7-8324-cb61be096bfb",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[ids-ips] - suricata",
                  "type": "node",
                  "x": 140,
                  "y": 23
                },
                {
                  "id": "e9481d69-bf57-40ff-9c8b-3846b7d05031",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[waf-loadbalancer] - nginx-modsecurity",
                  "type": "node",
                  "x": 60,
                  "y": 10
                },
                {
                  "id": "533d87d9-f571-4580-9224-501de2b99be3",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[app] - juice-shop",
                  "type": "node",
                  "x": 99,
                  "y": 10
                },
                {
                  "id": "07755553-4bec-4e6c-a92f-c60cc68010c1",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[log file] - /nginx.log",
                  "type": "node",
                  "x": 140,
                  "y": 99
                },
                {
                  "id": "457452a3-8999-4eaf-a8ea-f4fbc8fd293a",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[log file] - /modsecurity.log",
                  "type": "node",
                  "x": 140,
                  "y": 110
                },
                {
                  "id": "2e88cc79-8bc9-4773-b728-bdb653fc85fe",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[log file] - /tcp.pcap",
                  "type": "node",
                  "x": 140,
                  "y": 120
                },
                {
                  "id": "f4f17cc9-dc12-4996-b915-9b93fb95a49d",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[endpoint] - wazuh-agent",
                  "type": "node",
                  "x": 139,
                  "y": 37
                },
                {
                  "id": "8b7b9de0-c32c-485b-9893-7486e2a17e65",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[endpoint mgmt] - wazuh-manager",
                  "type": "node",
                  "x": 97,
                  "y": 89
                },
                {
                  "id": "95230a03-0940-4e94-a31b-d2712e0b27f1",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[log file] - /wazuh.log",
                  "type": "node",
                  "x": 140,
                  "y": 89
                },
                {
                  "id": "c9216fd3-a261-406e-bbdc-ca3cf0c7ef08",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[ci/cd] - jenkins",
                  "type": "node",
                  "x": 76,
                  "y": 60
                },
                {
                  "id": "d39aa8c7-d0a5-42f3-809e-91e364c71304",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[pki/secrets] - hashicorp-vault",
                  "type": "node",
                  "x": 48,
                  "y": 51
                },
                {
                  "id": "63b6d18b-26cf-463d-9a72-7c32953c82b6",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[git repo] - gitlab",
                  "type": "node",
                  "x": 48,
                  "y": 72
                },
                {
                  "id": "b78aa3ae-3b3d-4254-a82a-8b21a3a62638",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[frontend] - angular.js",
                  "type": "node",
                  "x": 140,
                  "y": 10
                },
                {
                  "id": "92c11836-7081-4919-9e1a-dd90245b0591",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[backend] - nodejs/express.js",
                  "type": "node",
                  "x": 178,
                  "y": 10
                },
                {
                  "id": "c666436a-628d-4829-928c-d643b20b2ae9",
                  "label_dx": 0,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[database] - sqlite",
                  "type": "node",
                  "x": 210,
                  "y": 10
                },
                {
                  "id": "7813474c-4278-4d99-a655-419213d63196",
                  "label_dx": null,
                  "label_dy": null,
                  "label_position": "top",
                  "name": "[siem] - splunk",
                  "type": "node",
                  "x": 48,
                  "y": 106
                }
              ],
              "edges": [
                {
                  "capacity": "100G",
                  "source": "Node2",
                  "target": "Node3"
                },
                {
                  "capacity": "100G",
                  "source": "Node3",
                  "target": "Node1"
                },
                {
                  "source": "attacker",
                  "target": "suricata",
                  "capacity": ""
                },
                {
                  "source": "suricata",
                  "target": "nginx-modsecurity",
                  "capacity": ""
                },
                {
                  "source": "nginx-modsecurity",
                  "target": "juice-shop",
                  "capacity": ""
                },
                {
                  "source": "splunk-universal-forwarder",
                  "target": "/nginx.log",
                  "capacity": ""
                },
                {
                  "source": "splunk-universal-forwarder",
                  "target": "/modsecurity.log",
                  "capacity": ""
                },
                {
                  "source": "splunk-universal-forwarder",
                  "target": "splunk",
                  "capacity": ""
                },
                {
                  "source": "defender",
                  "target": "splunk",
                  "capacity": ""
                },
                {
                  "source": "defender",
                  "target": "nginx-modsecurity",
                  "capacity": ""
                },
                {
                  "source": "defender",
                  "target": "juice-shop",
                  "capacity": ""
                },
                {
                  "source": "nginx-modsecurity",
                  "target": "/var/log/challenge1",
                  "capacity": ""
                },
                {
                  "source": "juice-shop",
                  "target": "/var/log/challenge1",
                  "capacity": ""
                },
                {
                  "source": "defender",
                  "target": "suricata",
                  "capacity": ""
                },
                {
                  "source": "/tcp.pcap",
                  "target": "splunk-universal-forwarder",
                  "capacity": ""
                },
                {
                  "source": "suricata",
                  "target": "/var/log/challenge1",
                  "capacity": ""
                },
                {
                  "source": "/var/log/challenge1",
                  "target": "/tcp.pcap",
                  "capacity": ""
                },
                {
                  "source": "/var/log/challenge1",
                  "target": "/modsecurity.log",
                  "capacity": ""
                },
                {
                  "source": "/var/log/challenge1",
                  "target": "/nginx.log",
                  "capacity": ""
                },
                {
                  "source": "splunk",
                  "target": "wazuh-manager",
                  "capacity": ""
                },
                {
                  "source": "juice-shop",
                  "target": "wazuh-agent",
                  "capacity": ""
                },
                {
                  "source": "/var/log/challenge1",
                  "target": "/wazuh.log",
                  "capacity": ""
                },
                {
                  "source": "/wazuh.log",
                  "target": "splunk-universal-forwarder",
                  "capacity": ""
                },
                {
                  "source": "[indexer] - splunk-universal-forwarder",
                  "target": "[log file] - /wazuh.log",
                  "capacity": ""
                },
                {
                  "source": "[indexer] - splunk-universal-forwarder",
                  "target": "[log file] - /nginx.log",
                  "capacity": ""
                },
                {
                  "source": "[indexer] - splunk-universal-forwarder",
                  "target": "[log file] - /modsecurity.log",
                  "capacity": ""
                },
                {
                  "source": "[indexer] - splunk-universal-forwarder",
                  "target": "[log file] - /tcp.pcap",
                  "capacity": ""
                },
                {
                  "source": "[log file] - /wazuh.log",
                  "target": "[persistent-volume] - /var/log/challenge1",
                  "capacity": ""
                },
                {
                  "source": "[log file] - /nginx.log",
                  "target": "[persistent-volume] - /var/log/challenge1",
                  "capacity": ""
                },
                {
                  "source": "[log file] - /modsecurity.log",
                  "target": "[persistent-volume] - /var/log/challenge1",
                  "capacity": ""
                },
                {
                  "source": "[log file] - /tcp.pcap",
                  "target": "[persistent-volume] - /var/log/challenge1",
                  "capacity": ""
                },
                {
                  "source": "[app] - juice-shop",
                  "target": "[frontend] - angular.js",
                  "capacity": ""
                },
                {
                  "source": "[frontend] - angular.js",
                  "target": "[backend] - nodejs/express.js",
                  "capacity": ""
                },
                {
                  "source": "[backend] - nodejs/express.js",
                  "target": "[database] - sqlite",
                  "capacity": ""
                },
                {
                  "source": "[endpoint] - wazuh-agent",
                  "target": "[endpoint mgmt] - wazuh-manager",
                  "capacity": ""
                },
                {
                  "source": "[attacker] - kali",
                  "target": "[waf-loadbalancer] - nginx-modsecurity",
                  "capacity": ""
                },
                {
                  "source": "[defender]",
                  "target": "[siem] - splunk",
                  "capacity": ""
                },
                {
                  "source": "[siem] - splunk",
                  "target": "[endpoint mgmt] - wazuh-manager",
                  "capacity": ""
                },
                {
                  "source": "[siem] - splunk",
                  "target": "[indexer] - splunk-universal-forwarder",
                  "capacity": ""
                },
                {
                  "source": "[defender]",
                  "target": "[waf-loadbalancer] - nginx-modsecurity",
                  "capacity": ""
                },
                {
                  "source": "[waf-loadbalancer] - nginx-modsecurity",
                  "target": "[app] - juice-shop",
                  "capacity": ""
                },
                {
                  "source": "[ci/cd] - jenkins",
                  "target": "[pki/secrets] - hashicorp-vault",
                  "capacity": ""
                },
                {
                  "source": "[git repo] - gitlab",
                  "target": "[ci/cd] - jenkins",
                  "capacity": ""
                },
                {
                  "source": "[defender]",
                  "target": "[git repo] - gitlab",
                  "capacity": ""
                },
                {
                  "source": "[defender]",
                  "target": "[ci/cd] - jenkins",
                  "capacity": ""
                },
                {
                  "source": "[ci/cd] - jenkins",
                  "target": "[app] - juice-shop",
                  "capacity": ""
                },
                {
                  "source": "[app] - juice-shop",
                  "target": "[ids-ips] - suricata",
                  "capacity": ""
                },
                {
                  "source": "[app] - juice-shop",
                  "target": "[endpoint] - wazuh-agent",
                  "capacity": ""
                },
                {
                  "source": "[defender]",
                  "target": "[pki/secrets] - hashicorp-vault",
                  "capacity": ""
                }
              ]
            },
            traffic:[],
            edgeColorMap:[
                {color: "#990000", label: ">=50 Gbps", range: [50, 100]},
                {color: "#bd0026", label: "20 - 50", range: [20, 50]},
                {color: "#cc4c02", label: "10 - 20", range: [10, 20]},
                {color: "#016c59", label: "5 - 10", range: [5, 10]},
                {color: "#238b45", label: "2 - 5", range: [2, 5]},
                {color: "#3690c0", label: "1 - 2", range: [1, 2]},
                {color: "#74a9cf", label: "0 - 1", range: [0, 1]}
            ],
            edgeThinknessMap:{
                "100G": 5,
                "10G": 3,
                "1G": 1.5,
                subG: 1
            },
            edgeShapeMap:{
                "AMST--BOST": {
                    shape: "curved",
                    direction: "right",
                    offset: 15
                },
                "LOND--NEWY": {
                    shape: "curved",
                    direction: "right",
                    offset: 15
                },
                "AOFA--LOND": {
                    shape: "curved",
                    direction: "right",
                    offset: 15
                },
                "CERN--WASH": {
                    shape: "curved",
                    direction: "right",
                    offset: 15
                }
            },
            nodeSizeMap:{
                hub: 10,
                esnet_site: 10,
                node: 10,
            },
            nodeShapeMap:{
                CERN: "square"
            },
            stylesMap:[],
        };
    }

    componentDidMount() {

    }



    render() {
        return (
          <div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64">
            <Paper className="w-full rounded-8 p-16 md:p-24" elevation={1}>
              <h1>Scenario</h1>
              <ul>
              <li>You receive alerts of an attack in progress against a web application from your SIEM (Splunk)</li>
              <li>The source of this alert if from the Web Application Firewall (Modsecurity)</li>
              <li>Detect and prevent the attacker from exfiltrating sensitive customer information!</li>
              <li>If you are not able to stop the attacker, identify artifacts to identify what information was taken.</li>
              <li>How to confirm that they are on the same subnet /24?</li>
              <li>What are the first things you do in this situation?</li>
              </ul>
              <br />
              <TrafficMap width={980} height={400} margin={50}
                  topology={this.state.topology}
                  edgeColorMap={this.state.edgeColorMap}
                  edgeDrawingMethod="bidirectionalArrow"
                  edgeThinknessMap={this.state.edgeThinknessMap}
                  edgeShapeMap={this.state.edgeShapeMap}
                  nodeSizeMap={this.state.nodeSizeMap}
                  nodeShapeMap={this.state.nodeShapeMap}
                  stylesMap={stylesMap} />
            </Paper>
          </div>
        )
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFormState: Actions.updateFormState
    }, dispatch);
}

function mapStateToProps({ auth }) {
    return {
        user: auth.user
    }
}

export default (withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(CourseScenario)));
