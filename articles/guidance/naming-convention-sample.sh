#!/bin/sh

# Set up variables to build out the naming conventions for deploying
# the cluster
LOCATION=eastus2
APP_NAME=profx
ENVIRONMENT=prod

# Set up the tags to associate with items in the application
TAG_BILLTO="InternalApp-ProFX-12345"
TAGS=""

# Set up the names of things using recommended conventions
RESOURCE_GROUP="${APP_NAME}-${ENVIRONMENT}-rg"
VNET_NAME="${APP_NAME}-vnet"

# Step 1 - create the enclosing resource group
azure create group --name "${RESOURCE_GROUP}" --location "${LOCATION}" --tags "${TAGS}"

# Step 2 - create the network security groups

# Step 2 - create the networks (VNet and subnets)
azure network vnet create --name "${VNET_NAME}" --address-prefixes="10.0.0.0/8" --location "${LOCATION}" --resource-group "${RESOURCE_GROUP}" --tags "${TAGS}"
# TODO - does subnet support tagging?
azure network vnet subnet create --name TODO --vnet-name "${VNET_NAME}" --address-prefix="10.0.1.0/24" --resource-group "${RESOURCE_GROUP}"

# Step N - define the load balancer and network security rules
