---
title: Quickstart – Azure SDK for JavaScript and TypeScript for Azure Managed Confidential Consortium Framework 
description: Learn to use the Azure SDK for JavaScript and TypeScript library for Azure Managed Confidential Consortium Framework
author: msftsettiy
ms.author: settiy
ms.date: 09/11/2023
ms.service: confidential-ledger
ms.topic: quickstart
ms.custom: mode-api, devx-track-js
---

# Quickstart: Create an Azure Managed CCF resource using the Azure SDK for JavaScript and TypeScript

Microsoft Azure Managed CCF (Managed CCF) is a new and highly secure service for deploying confidential applications. For more information on Azure Managed CCF, see [About Azure Managed Confidential Consortium Framework](overview.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[API reference documentation](/javascript/api/overview/azure/confidential-ledger) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/confidentialledger/arm-confidentialledger) | [Package (npm)](https://www.npmjs.com/package/@azure/arm-confidentialledger)

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Node.js versions supported by the [Azure SDK for JavaScript](/javascript/api/overview/azure/arm-confidentialledger-readme#currently-supported-environments).
- [OpenSSL](https://www.openssl.org/) on a computer running Windows or Linux.

## Setup

This quickstart uses the Azure Identity library, along with Azure CLI or Azure PowerShell, to authenticate user to Azure Services. Developers can also use Visual Studio or Visual Studio Code to authenticate their calls. For more information, see [Authenticate the client with Azure Identity client library](/python/api/overview/azure/identity-readme).

### Sign in to Azure

[!INCLUDE [Sign in to Azure](../../includes/confidential-ledger-sign-in-azure.md)]

### Install the packages

In a terminal or command prompt, create a suitable project folder, and then create and activate a Python virtual environment as described on [Use Python virtual environments](/azure/developer/python/configure-local-development-environment?tabs=cmd#use-python-virtual-environments).

Install the Azure Active Directory identity client library.

```terminal
npm install @azure/identity
```

Install the Azure Confidential Ledger management plane client library.

```terminal
npm install @azure/arm-confidentialledger@1.3.0-beta.1
```

### Create a resource group

[!INCLUDE [Create resource group](./includes/powershell-resource-group-create.md)]

### Register the resource provider

[!INCLUDE [Register the resource provider](includes/register-provider.md)]

### Create members

[!INCLUDE [Create member](includes/create-member.md)]

## Create the JavaScript application

### Use the Management plane client library

The Azure SDK for JavaScript and TypeScript library (azure/arm-confidentialledger) allows operations on Managed CCF resources, such as creation and deletion, listing the resources associated with a subscription, and viewing the details of a specific resource. The following piece of code creates and views the properties of a Managed CCF resource.

```JavaScript
import  { ConfidentialLedgerClient, ManagedCCFProperties, ManagedCCF, KnownLanguageRuntime, DeploymentType, MemberIdentityCertificate } from "@azure/arm-confidentialledger";
import { DefaultAzureCredential } from "@azure/identity";
import { Console } from "console";

const subscriptionId = "0000000-0000-0000-0000-000000000001"; // replace
const rgName = "myResourceGroup";
const ledgerId = "confidentialbillingapp";

let client: ConfidentialLedgerClient;

export async function main() {
    console.log("Creating a new instance.")
    client = new ConfidentialLedgerClient(new DefaultAzureCredential(), subscriptionId);

    let properties = <ManagedCCFProperties> {
        deploymentType: <DeploymentType> {
            appSourceUri: "",
            languageRuntime: KnownLanguageRuntime.JS
        },
        memberIdentityCertificates: [
            <MemberIdentityCertificate>{
                certificate: "-----BEGIN CERTIFICATE-----\nMIIBvjCCAUSgAwIBAg...0d71ZtULNWo\n-----END CERTIFICATE-----",
                encryptionkey: "",
                tags: { 
                    "owner":"member0"
                }
            },
            <MemberIdentityCertificate>{
                certificate: "-----BEGIN CERTIFICATE-----\nMIIBwDCCAUagAwIBAgI...2FSyKIC+vY=\n-----END CERTIFICATE-----",
                encryptionkey: "",
                tags: { 
                    "owner":"member1"
                }
            },
        ],
        nodeCount: 3,
    };

    let mccf = <ManagedCCF> {
        location: "SouthCentralUS",
        properties: properties,
    }

    let createResponse = await client.managedCCFOperations.beginCreateAndWait(rgName, ledgerId, mccf);
    console.log("Created. Instance id: " +  createResponse.id);

    // Get details of the instance
    console.log("Getting instance details.");
    let getResponse = await client.managedCCFOperations.get(rgName, ledgerId);
    console.log(getResponse.properties?.identityServiceUri);
    console.log(getResponse.properties?.nodeCount);

    // List mccf instances in the RG
    console.log("Listing the instances in the resource group.");
    let instancePages = await client.managedCCFOperations.listByResourceGroup(rgName).byPage();
    for await(const page of instancePages){
        for(const instance of page)
        {
            console.log(instance.name + "\t" + instance.location + "\t" + instance.properties?.nodeCount);
        }
    }

    console.log("Delete the instance.");
    await client.managedCCFOperations.beginDeleteAndWait(rgName, ledgerId);
    console.log("Deleted.");
}

main().catch((err) => {
    console.error(err);
});
```

## Clean up resources

Other Managed CCF articles can build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you might wish to leave these resources in place.

Otherwise, when you're finished with the resources created in this article, use the Azure CLI [az group delete](/cli/azure/group?#az-group-delete) command to delete the resource group and all its contained resources.

```azurecli
az group delete --resource-group myResourceGroup
```

## Next steps

In this quickstart, you created a Managed CCF resource by using the Azure Python SDK for Confidential Ledger. To learn more about Azure Managed CCF and how to integrate it with your applications, continue on to these articles:

- [Azure Managed CCF overview](overview.md)
- [Quickstart: Azure portal](quickstart-portal.md)
- [Quickstart: Azure CLI](quickstart-cli.md)
- [How to: Activate members](how-to-activate-members.md)
