---
layout: default
title: Deploy an Azure Virtual Enclaves (AVE) Community with Enclaves using an ARM template
parent: Quickstarts
nav_order: 1
---

# Quickstart: Deploy an Azure Virtual Enclaves (AVE) Community with Enclaves using an ARM template
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

# Quickstart: Deploy an Azure Virtual Enclaves (AVE) Community with Enclaves using an ARM template

[Azure Virtual Enclaves](/docs/overview/what%20is%20azure%20virtual%20enclaves) accelerates and streamlines the deployment and management of secure, isolated, and compliant cloud environments for the most sensitive missions and workloads across commercial and air-gapped environments. In this quickstart, you:

- Deploy one AVE [community](/docs/overview/what%20is%20a%20community) with two [enclaves](/docs/overview/what%20is%20an%20enclave) using an Azure Resource Manager (ARM) template.
- Deploy [workloads](/docs/overview/what%20is%20a%20workload), [enclave endpoints](/docs/overview/what%20is%20an%20enclave%20endpoint), [transit hubs](/docs/overview/what%20is%20a%20transit%20hub) and [community endpoints](/docs/overview/what%20is%20a%20community%20endpoint), and [enclave connections](/docs/overview/what%20is%20an%20enclave%20connection) across your community using an ARM template.

> Note
>
> This sample deployment is just for demo purposes and doesn't represent all the best practices for network, systems, or applications administration.

## Before you begin
- This quickstart assumes a basic understanding of networking and Azure Virtual Enclaves concepts. For more information, see [Concepts and best practices of Azure Virtual Enclaves](/docs/Concepts/Concepts-and-best-practices).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- A [resource manager template](/en-us/azure/azure-resource-manager/templates/overview) is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax. In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment.

- If your environment meets the prerequisites and you're familiar with ARM templates, select Deploy to Azure to open the template in the Azure portal.

## Review the template

The template used in this quickstart can be found [here](/assets/code/nightly-base.json).

### What gets deployed
![Nightly-docs.svg](/assets/Nightly-docs.svg)

- Community (x1)
- Enclaves (x2)
- Workload (x1, empty, created in `enc-1`)
- Community Endpoints: 
    - `plx`
        - `plx-vpaw`; sample values of demonstrating PrivateNetwork connectivity
        - `plx-dataplane`, 
    - `bing-outlook`; sample values of demonstrating Internet connectivity
        - `bing.com`
        - `outlook.com`
- Enclave Endpoint:
    - `ADDS-TCP` and `ADDS-UDP` - Ports/Protocols covering a fake AD DS instance
- Transit Hub:
    - Input parameter to a remote virtual network; covering Gateway connection
- Enclave Connections
    - | Source | Destination |
      |--|--|
      | Enclave 2 | Enclave 1 Endpoint `ADDS-TCP/UDP` |
      | Enclave 2 | Community Endpoint `bing-outlook` |
      | Enclave 2 | Community Endpoint `plx` |
      | Community (via Transit hub) | Enclave 1 Endpoint `ADDS-TCP/UDP` |

## Deploy the template
1. Login to the Azure Portal, search and select the **Template Specs** service. Select **Create template spec**. In the ARM Template section, upload or copy and paste the above ARM template.
![image.png](/assets/image-3087f961-30be-4cec-9989-cfb5020f7fdb.png)

2. On the **Basics** page, leave the default values, and configure the following template parameters:
   - **Subscription**: Select an Azure subscription.
   - **Resource group**: Select Create new. Enter a unique name for the resource group, such as `myResourceGroup`, then select OK.
   - **Location**: Select a location, such as East US.
   - **Community Name**: Name of the Community (ex: `My-Community`)
   - **Enclave Name**: Name of the Enclave (ex: `My-Enclave`)
   - **Endpoint name**: Name of the enclave endpoint (ex: `endpoint-bingdotcom`)

3. Select **Review + Create** > **Create**.

4. Once the template is created and available on the **Template Specs** page, select newly created ARM template and then click on **Deploy**.  

5. On the **Deploy <template name>** page, leave default values and configure the following parameters:
   - **Community Name**: Name of the Community (ex: `My-Community`)
   - **Enclave Name**: Name of the Enclave (ex: `My-Enclave`)
   - **Endpoint name**: Name of the enclave endpoint (ex: `endpoint-bingdotcom`)
   
6.  Select **Review + Create** > **Create**.

It can take up to 50 minutes to finish all resource creation. Wait for the deployment to be successfully completed before you take any actions within your deployed resources.

## Validate the deployment

Learn more about what gets deployed in a [community](/docs/overview/what%20is%20a%20community) and what gets deployed in an [enclave](/docs/overview/what%20is%20an%20enclave).

### Connect to the admin workstations
Learn more about how to access resources within your enclave from the Enclave Admin Workstation [here](/docs/Concepts/Understanding-Admin-Workstations).

## Delete the deployment
If you do not plan on keeping these resources, clean up unnecessary resources to avoid Azure charges.
