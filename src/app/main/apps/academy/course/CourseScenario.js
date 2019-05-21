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
        normal: {fill: "#696969", stroke: "none", fontSize: 9},
        selected: {fill: "#333", stroke: "none", fontSize: 11},
        muted: {fill: "#696969", stroke: "none", fontSize: 8,
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
        normal: {fill: "#696969", stroke: "none", fontSize: 9},
        selected: {fill: "#333",stroke: "none", fontSize: 11},
        muted: {fill: "#696969", stroke: "none", fontSize: 8,
        opacity: 0.6}
    }
};

// Mapping of node type to style
const stylesMap = {
    hub: hubStyle,
    esnet_site: siteStyle
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
                    "name": "attacker",
                    "type": "hub",
                    "x": 30,
                    "y": 17,
                    "id": "6ccdfc0b-cb53-4d41-a732-bd2c45915b01"
                  },
                  {
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "defender",
                    "site": 5,
                    "type": "hub",
                    "x": 29,
                    "y": 58,
                    "id": "73f2ae11-0320-4024-bbbe-33b26a820412"
                  },
                  {
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "splunk",
                    "site": 5,
                    "type": "hub",
                    "x": 67,
                    "y": 84,
                    "id": "ec9eac3b-c4db-4810-ab8a-51b7d6812b89"
                  },
                  {
                    "id": "6e62cf17-9f66-495a-8d5b-e25f903a430a",
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "splunk-universal-forwarder",
                    "type": "node",
                    "x": 100,
                    "y": 84
                  },
                  {
                    "id": "ca35487f-f1ab-41b5-b400-51b8698a92b0",
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "/var/log/challenge1",
                    "type": "node",
                    "x": 176,
                    "y": 86
                  },
                  {
                    "id": "aae302c0-1517-4fc7-8324-cb61be096bfb",
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "suricata",
                    "type": "node",
                    "x": 103,
                    "y": 17
                  },
                  {
                    "id": "e9481d69-bf57-40ff-9c8b-3846b7d05031",
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "nginx-modsecurity",
                    "type": "node",
                    "x": 140,
                    "y": 16
                  },
                  {
                    "id": "533d87d9-f571-4580-9224-501de2b99be3",
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "juice-shop",
                    "type": "node",
                    "x": 178,
                    "y": 15
                  },
                  {
                    "id": "abe40c80-25ef-4697-9ccf-b34aa16297bb",
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "wireshark",
                    "type": "node",
                    "x": 67,
                    "y": 109
                  },
                  {
                    "id": "07755553-4bec-4e6c-a92f-c60cc68010c1",
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "/nginx.log",
                    "type": "node",
                    "x": 139,
                    "y": 76
                  },
                  {
                    "id": "457452a3-8999-4eaf-a8ea-f4fbc8fd293a",
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "/modsecurity.log",
                    "type": "node",
                    "x": 139,
                    "y": 87
                  },
                  {
                    "id": "2e88cc79-8bc9-4773-b728-bdb653fc85fe",
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "/tcp.pcap",
                    "type": "node",
                    "x": 139,
                    "y": 98
                  },
                  {
                    "id": "f4f17cc9-dc12-4996-b915-9b93fb95a49d",
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "wazuh-agent",
                    "type": "node",
                    "x": 169,
                    "y": 58
                  },
                  {
                    "id": "8b7b9de0-c32c-485b-9893-7486e2a17e65",
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "wazuh-manager",
                    "type": "node",
                    "x": 67,
                    "y": 59
                  },
                  {
                    "id": "95230a03-0940-4e94-a31b-d2712e0b27f1",
                    "label_dx": null,
                    "label_dy": null,
                    "label_position": "top",
                    "name": "/wazuh.log",
                    "type": "node",
                    "x": 139,
                    "y": 66
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
                    "source": "defender",
                    "target": "wireshark",
                    "capacity": ""
                  },
                  {
                    "source": "wireshark",
                    "target": "/tcp.pcap",
                    "capacity": ""
                  },
                  {
                    "source": "defender",
                    "target": "wazuh-manager",
                    "capacity": ""
                  },
                  {
                    "source": "splunk",
                    "target": "wazuh-manager",
                    "capacity": ""
                  },
                  {
                    "source": "wazuh-agent",
                    "target": "wazuh-manager",
                    "capacity": ""
                  },
                  {
                    "source": "juice-shop",
                    "target": "wazuh-agent",
                    "capacity": ""
                  },
                  {
                    "source": "wazuh-agent",
                    "target": "/var/log/challenge1",
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
                hub: 5.5,
                esnet_site: 7
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
                <Paper className="w-full max-w-lg rounded-8 p-16 md:p-24" elevation={1}>
                    <h1>Scenario</h1>
                    <ul>
                    <li>You receive alerts of an attack in progress against a web application from your SIEM (Splunk)</li>
                    <li>The source of this alert if from the Web Application Firewall (Modsecurity)</li>
                    <li>Detect and prevent the attacker from exfiltrating sensitive customer information!</li>
                    <li>If you are not able to stop the attacker, identify artifacts to identify what information was taken.</li>
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
