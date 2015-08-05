# How to create a VNet

This document will help you create a VNet in Azure based on the scenario in the figure below.

![Azure VNet](.\media\virtual-network-create-vnet\figure01.png)

In the figure above, you see a VNet that uses 192.168.0.0/16 as its CIDR address range, and contains two subnets as follows:

- FrontEnd: CIDR address range 192.168.1.0/24
- BackEnd: CIDR address range 192.168.2.0/24

If you are new to VNets, make sure you read the [virtual network overview](.\virtual-networks-overview.md) document.