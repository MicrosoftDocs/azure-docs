---
title: Azure Virtual Enclaves Deployment Templates
description: Azure Virtual Enclaves Deployment Templates
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Azure Virtual Enclaves Deployment Templates

## ARM Templates

### Community and Enclaves Template

[What gets deployed](./deploy-an-ave-community-with-enclaves.md/#what-gets-deployed)
1. 1  [Community](./what-is-a-community.md)
2. 2  [Community Endpoints](./what-is-a-community-endpoint.md)
3. 1  [Transit Hub](./what-is-a-transit-hub.md)
4. 1  [Enclaves](./what-is-an-enclave.md)
5. 1  [Workloads](./what-is-a-workload.md)
6. 1  [Enclave Endpoint](./what-is-an-enclave-endpoint.md)
7. 4  [Enclave Connections](./what-is-an-enclave-connection.md)

[ARM Template](./media/code/nightly-base.json) (easiest to deploy via Portal, powershell, or command line)

[Bicep Template](./media/code/nightly-base.bicep) (easiest to edit and maintain then convert to ARM template before deployment)

[Deploy the template](./deploy-an-ave-community-with-enclaves.md/#deploy-the-template)

### Secure Azure Computing Architecture (SACA) Template
An example of how to deploy the SACA within AVE.

What gets deployed:
1. 1  [Community](./what-is-a-community.md)
2. 3  [Community Endpoints](./what-is-a-community-endpoint.md)
3. 1  [Transit Hub](./what-is-a-transit-hub.md)
4. 4  [Enclaves](./what-is-an-enclave.md)
5. 4  [Workloads](./what-is-a-workload.md)
6. 1  [Enclave Endpoint](./what-is-an-enclave-endpoint.md)
7. 9  [Enclave Connections](./what-is-an-enclave-connection.md)

![image](./media/ave-saca.png)

[ARM Template](./media/code/ave-saca.json) (easiest to deploy via Portal, powershell, or command line)

[Bicep Template](./media/code/ave-saca.bicep) (easiest to edit and maintain then convert to ARM template before deployment)

Deploy the template:
1. In the Azure portal, type "deploy" into the top search bar and select "Deploy a Custom Template"
2. Select "Build your own template in the editor"
3. Replace the default template with the template linked above (e.g. copy the text inside the json file).  See [this article](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal#edit-and-deploy-the-template) if you have any issues with the above steps.
4. Select "Save"
5. Under "Resource Group", select "Create New" and enter the resource group name you would like to use (e.g. community-template-rg) for the AVE resources.
6. Optionally, Under "Unique Number", increment the number if previous deployments occured in the same resources group.
9. The remaining parameters that are not required can be left as the default unless you would like to test a modification. It is recommended to keep the defaults for the first test deployment.
10. Select "Review + Create" and then "Create"


### Complex AVE Demo Environment Template

What gets deployed:
1. 1  [Community](./what-is-a-community.md)
2. 3  [Community Endpoints](./what-is-a-community-endpoint.md)
3. 1  [Transit Hub](./what-is-a-transit-hub.md)
4. 8  [Enclaves](./what-is-an-enclave.md)
5. 8  [Workloads](./what-is-a-workload.md)
6. 11 [Enclave Endpoint](./what-is-an-enclave-endpoint.md)
7. 25 [Enclave Connections](./what-is-an-enclave-connection.md)

![image](./media/AVE-demo-env.png)


[ARM Template](./media/code/ave-demo-env.json) (easiest to deploy via Portal, powershell, or command line)

[Bicep Template](./media/code/ave-demo-env.bicep) (easiest to edit and maintain then convert to ARM template before deployment)

Deploy the template:
1. In the Azure portal, type "deploy" into the top search bar and select "Deploy a Custom Template"
2. Select "Build your own template in the editor"
3. Replace the default template with the template linked above (e.g. copy the text inside the json file).  See [this article](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal#edit-and-deploy-the-template) if you have any issues with the above steps.
4. Select "Save"
5. Under "Resource Group", select "Create New" and enter the resource group name you would like to use (e.g. community-template-rg) for the AVE resources.
6. Optionally, Under "Unique Number", increment the number if previous deployments occured in the same resources group.
9. The remaining parameters that are not required can be left as the default unless you would like to test a modification. It is recommended to keep the defaults for the first test deployment.
10. Select "Review + Create" and then "Create"

### Community Template
What gets deployed:
1. 1 [Community](./what-is-a-community.md)
2. 2 [Community Endpoints](./what-is-a-community-endpoint.md)
3. 1 [Transit Hub](./what-is-a-transit-hub.md)

[ARM Template](./media/code/community.json) (easiest to deploy via Portal, powershell, or command line)

Deploy the template:
1. In the Azure portal, type "deploy" into the top search bar and select "Deploy a Custom Template"
2. Select "Build your own template in the editor"
3. Replace the default template with the template linked above (e.g. copy the text inside the json file).  See [this article](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal#edit-and-deploy-the-template) if you have any issues with the above steps.
4. Select "Save"
5. Under "Resource Group", select "Create New" and enter the resource group name you would like to use (e.g. community-template-rg). It is recommended to use the same resource group for other AVE resources but not required.
6. Under "Community Name", enter the community name you would like to use (e.g. cm-template-test)
7. Select "Review + Create" and then "Create"

### Enclave Template
What gets deployed:
1. 1 [Enclave](./what-is-an-enclave.md)

[ARM Template](./media/code/enclave.json) (easiest to deploy via Portal, powershell, or command line)

Deploy the template:
1. In the Azure portal, type "deploy" into the top search bar and select "Deploy a Custom Template"
2. Select "Build your own template in the editor"
3. Replace the default template with the template linked above (e.g. copy the text inside the json file).  See [this article](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal#edit-and-deploy-the-template) if you have any issues with the above steps.
4. Select "Save"
5. Under "Resource Group", select "Create New" and enter the resource group name you would like to use (e.g. community-template-rg). It is recommended to use the same resource group for other AVE resources but not required.
6. Enter the "Community Resource Id" which can be found on the community "Properties" page under "Id".
7. Enter the new "Enclave Name" you would like to create (e.g. enc-template-test)
8. Enter the "Community Address Space" which can be found on the community "Overview" page (e.g. 10.0.0.0/16)
9. Enter the "Enclave Third Octet" which is a number from 2-255 that is unused by other enclaves.
10. Select "Review + Create" and then "Create"

### Endpoints Template
What gets deployed:
1. 1 [Enclave Endpoint](./what-is-an-enclave-endpoint.md)

[ARM Template](./media/code/endpointsv2.json) (easiest to deploy via Portal, powershell, or command line)

Deploy the template:
1. In the Azure portal, type "deploy" into the top search bar and select "Deploy a Custom Template"
2. Select "Build your own template in the editor"
3. Replace the default template with the template linked above (e.g. copy the text inside the json file).  See [this article](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal#edit-and-deploy-the-template) if you have any issues with the above steps.
4. Select "Save"
5. Under "Resource Group", select "Create New" and enter the resource group name you would like to use (e.g. community-template-rg). It is recommended to use the same resource group for other AVE resources but not required.
6. Enter the "Enclave Name" of the existing enclave you would like to add an endpoint to (e.g. enc-template-test)
7. Enter the "Enclave Address Space" for the enclave you are adding the endpoint to (e.g. 10.0.2.0/23). You can find this by clicking on the enclave resource, on the overview blade select the "virtual network" link, and select the "Address Space" blade.
8. Select "Review + Create" and then "Create"

### Connections Template
What gets deployed:
1. 3 [Enclave Connections](./what-is-an-enclave-connection.md)

[ARM Template](./media/code/connectionsv2.json) (easiest to deploy via Portal, powershell, or command line)

Deploy the template:
1. In the Azure portal, type "deploy" into the top search bar and select "Deploy a Custom Template"
2. Select "Build your own template in the editor"
3. Replace the default template with the template linked above (e.g. copy the text inside the json file).  See [this article](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal#edit-and-deploy-the-template) if you have any issues with the above steps.
4. Select "Save"
5. Under "Resource Group", select "Create New" and enter the resource group name you would like to use (e.g. community-template-rg). It is recommended to use the same resource group for other AVE resources but not required.
6. Enter the "Community Resource Id" which can be found on the community "Properties" page under "Id".
7. Enter the "Source Enclave Resource Id" which can be found on the source enclave "Properties" page under "Id".
8. Enter the "ADDS Endpoint Resource Id" which can be found on the ADDS endpoint "Properties" page under "Id".
9. Enter the "Example Endpoint Resource Id" which can be found on the Example endpoint "Properties" page under "Id".
10. Enter the "Msft Sites Endpoint Resource Id" which can be found on the Example endpoint "Properties" page under "Id".
11. Enter the "Source Enclave Address Space" for the source enclave in your connection (e.g. 10.0.2.0/23). You can find this by clicking on the enclave resource, on the overview blade select the "virtual network" link, and select the "Address Space" blade.
12. Select "Review + Create" and then "Create"

## Bicep Templates
### Community and Enclaves Template

[What gets deployed](./deploy-an-ave-community-with-enclaves/#what-gets-deployed.md)

[Bicep Template](./media/code/nightly-base.bicep) (easiest to deploy via Portal, powershell, or command line)

[Deploy the template](./deploy-an-ave-community-with-enclaves/#deploy-the-template)

## Terraform
Pending Public Preview product release
