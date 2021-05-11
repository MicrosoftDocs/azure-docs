---
title: Azure Confidential Ledger workflows
description: An overview of Azure Confidential Ledger workflows, a highly secure service for managing sensitive data records
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: overview
ms.date: 05/15/2021
ms.author: mbaldwin

---
# Administrative and Functional Workflows

## Administrative Workflows

This section covers the APIs for performing administrative actions such as Creating, Updating, Listing, Deleting ledgers. These APIs are documented using Swagger which provides an easy-to-use interface with default values and examples.

## Getting Started

Administrative APIs need user login credentials. Administrators should use their AAD based accounts to login. Once authenticated, they can manage ledgers associated with their Subscription.
Following customer details are required as part of onboarding and should be provided in the onboarding doc.
- Tenant Id (GUID or UUID. E.g. 3720b0bf-1395-4733-bf1e-a1388b7517a8)
- Subscription Id (GUID or UUID. E.g. b720800f-31e6-40e4-b316-8962464739e8)
- AAD accounts (e.g. admin@contoso.com)

Once a customer has created a Confidential Ledger, they can interact with it by executing POST/GET operations via the Functional APIs. User will need to install dependencies to be able to execute the provided code samples as part of Functional workflows. More details about Functional Workflows can be found in the later section.

### Workflow 1: Create a Confidential Ledger

Prerequisites:
- Onboarding of Subscription and Admins has been completed.
- Client Certificate that needs to be provided during ledger creation has been created.
- Make sure you are authenticated in the Swagger page with your AAD account that was provided during onboarding. All the APIs listed below require you to be
authenticated.

:::image type="content" source="./media/create-ledger-1.png" alt-text="Create Ledger screenshot 1":::

> [!NOTE]
> Your authentication is valid for an hour.

To add a new ledger:
1. Open [ACCL admin console](https://controlplane.accledger.azure.com/swagger)
1. Select PUT → Try it out
1. Add all requested parameter values and updated the request body correctly. The sample code can help you begin here. The certificate is necessity in this step.
1. LedgerType can be "Public" or "Private" and it needs to be passed in the request body. After Confidential Ledger has been provisioned LedgerType cannot be changed.
1. Select Execute

:::image type="content" source="./media/create-ledger-2.png" alt-text="Create Ledger screenshot 2":::

> [!NOTE]
> Multiple user certs can be provided in the request body.

Ledger Creation API Request Body Sample:

```json
{
	"sku": "Standard",
	"location": "EastUS",
	"tags": {
		"IsPreProduction": "true",
		"otherPropertiesKey": "otherPropertiesValue"
	},
	"LedgerType": "Public",
	"LedgerStorageAccount": "contosoLedger",
	"LedgerCertUsers": [{
		"cert": "-----BEGIN CERTIFICATE-----\nMIIBsTCCATigAwIBAgIUZS+LFyXciCNorqV0iQd442DpsScwCgYIKoZIzj0EAwMwEDEOMAwGA1UEAwwFdXNlcjAwHhcNMjAwNzEzMjIxODMwWhcNMjEwNzEzMjIxODMwWjAQMQ4wDAYDVQQDDAV1c2VyMDB2MBAGByqGSM49AgEGBSuBBAAiA2IABH0ccagmRk+aGlldCa/k5mWbrCZLqyUS3I58psmV1QDMCVyoQh3B4w3vbb81fz7OM56MIaU8Bg5nj9cBowoPfE+ygBuisjLl51IxvmTDxSgdNw4h1c7VxNKcrjhVe5+vF6NTMFEwHQYDVR0OBBYEFGnZkmxh4mZIC/tQm+rB8czF1JG7MB8GA1UdIwQYMBaAFGnZkmxh4mZIC/tQm+rB8czF1JG7MA8GA1UdEwEB/wQFMAMBAf8wCgYIKoZIzj0EAwMDZwAwZAIvHa6nCHmBCUSBDQXa9Ln3XBzs9itZWXIeDF918Ze7CXuzj+e+9OqmKZbTT2JLC9UCMQD5x0QHM23ygCMIxMIYzyf6FHr3xYCOck6mD7iJKPvrnx0CrkYFayVoj0BE3vWS03c=\n-----END CERTIFICATE-----",
		"LedgerPermission": "All"
	}]
}
```

Ledger Creation API Response Sample: 

```json
{
	"id": "string",
	"type": "test-Ledger",
	"location": "EastUS",
	"resourceGroup": "TestRG",
	"tags": {
		"IsPreProduction": "true"
	},
	"sku": "Standard",
	"LedgerProperties": {
		"LedgerName": "test-Ledger-2",
		"LedgerUri": "https://test-Ledger-2-33e01921-ppe.eastus.cloudapp.azure.com ",
		"identityServiceUri": "https://identity.accLedger-ppe.azure.com/networkIdentity/test-Ledger-2-33e01921",
		"LedgerStorageAccount": "contosoLedger",
		"LedgerType": "Public",
		"LedgerCertUsers": [{
			"cert": "-----BEGIN CERTIFICATE-----\nMIIBsTCCATigAwIBAgIUXsgRTCO9RrUdCuStbLcQVQnxLcMwCgYIKoZIzj0EAwMwEDEOMAwGA1UEAwwFdXNlcjAwHhcNMjAwOTE1MjIwNjE0WhcNMjEwOTE1MjIwNjE0WjAQMQ4wDAYDVQQDDAV1c2VyMDB2MBAGByqGSM49AgEGBSuBBAAiA2IABOIJw+QxfagH6upjQF5l/h4o8SjGQAaOwkZ2jRtGeGwZlAzWrVfoVJuuGW16SmQmdGF7vTo41d68D1SqZ3auY/O6sL0ycExRtrXC1K/iX3yjrnhHKUHC5EJ69f0shb43ZaNTMFEwHQYDVR0OBBYEFNZ/wAQqJXlxApOrgqj0nWBvvtl6MB8GA1UdIwQYMBaAFNZ/wAQqJXlxApOrgqj0nWBvvtl6MA8GA1UdEwEB/wQFMAMBAf8wCgYIKoZIzj0EAwMDZwAwZAIwT60hMhgWh0m1O+KldOBYEuwf/m+nMXKJA1i+pQL9esEM1xmkP6M7ayY1zqwqhtsOAjA2O3nw03Xeb6s84MqO37rfAz16yDPS7G/8sHQ1wcNB8FlKXnmDwbALk3W4UDotRwg=\n-----END CERTIFICATE-----",
			"LedgerPermission": "All"
		}]
	}
}
```

You can copy the example value and update the Ledger resource name along with other fields to create a new Ledger.  Once the Confidential Ledger has been created, you can query the Ledger using the network identity from the identity service (its URL is part of the Ledger creation response).  It can take up to 5 minutes to create a ledger.

### Workflow 2: Access Confidential Ledger Information

Use this to get details about the Ledger resource you have created:

1. Open the [ACCL admin console](https://controlplane.accledger.azure.com/swagger).

    :::image type="content" source="./media/create-ledger-1.png" alt-text="Create Ledger screenshot 1":::

1. Select Get → Try it out There are three variations to choose from.
1. Add all requested parameter values.
1. Select Execute

Option 1: Get Confidential Ledgers for a given subscription ID

:::image type="content" source="./media/create-ledger-2.png" alt-text="Create Ledger screenshot 2":::

Option 2: Get Confidential Ledgers for a specific Resource Group

:::image type="content" source="./media/create-ledger-3.png" alt-text="Create Ledger screenshot 3":::

Option 3: Get the properties associated with a specific Confidential Ledger

:::image type="content" source="./media/create-ledger-4.png" alt-text="Create Ledger screenshot 4":::

Ledger Get API success Response Sample: 

```json
{
	"sku": "Standard",
	"LedgerProperties": {
		"LedgerName": "test-Ledger-2",
		"LedgerUri": "https://test-Ledger-2-33e01921-ppe.eastus.cloudapp.azure.com",
		"identityServiceUri": "https://identity.accLedger-ppe.azure.com/networkIdentity/test-Ledger-2-33e01921",
		"LedgerStorageAccount": "contosoLedger",
		"LedgerType": "Public",
		"LedgerCertUsers": [{
			"cert": "-----BEGIN CERTIFICATE-----\nMIIBuDCCAT6gAwIBAgIUB09nlw/FVTupTBYv2QfZTY9agBgwCgYIKoZIzj0EAwMwEzERMA8GA1UEAwwIdXNlcmNlcnQwHhcNMjAxMDA2MjIzOTQ4WhcNMjExMDA2MjIzOTQ4WjATMREwDwYDVQQDDAh1c2VyY2VydDB2MBAGByqGSM49AgEGBSuBBAAiA2IABLTi/AfE6r2lHOq7zpgi0wV/4Kl3e7hifgKjSSNDtDcE0vs0nYqxfcLemEXjt8TRSHq0/Oeshq2t76ekemxrM0rIoRZMLUzPMY69Pc+7jMWLh5JxwqiFwHVVOmqEVAbxPqNTMFEwHQYDVR0OBBYEFJXNRqWty+1bK9uRTVApustmXsH3MB8GA1UdIwQYMBaAFJXNRqWty+1bK9uRTVApustmXsH3MA8GA1UdEwEB/wQFMAMBAf8wCgYIKoZIzj0EAwMDaAAwZQIwM551vcB0g+QMLWIk61ynTlpQ36gQfiy5tMTAA84f65KTbKK+lbisQyNE7XnQP1JYAjEA5swgYgzQDO/5fiWJFWI5FBvA672WdNJMVgnajJdZDVDRUAilUa+VZvlY77eJSYCb\n-----END CERTIFICATE-----",
			"LedgerPermission": "All"
		}]
	},
	"id": "string",
	"type": "Microsoft.ACCLedger/Ledgers",
	"location": "EastUS",
	"resourceGroup": "TestRG",
	"tags": {
		"IsPreProduction": "true"
	}
}
```

Your specific ledger properties will be shown under "tags".

### Workflow 3: Update the Confidential Ledger

Use this to change or add properties to the Confidential Ledger. To make an update:

1. Open the [ACCL admin console](https://controlplane.accledger.azure.com/swagger)

    :::image type="content" source="./media/create-ledger-5.png" alt-text="Create Ledger screenshot 5":::

1. Select Patch → Try it out
1. Add all requested values under Parameters
1. Update the Request body. You can utilize the sample code as a starting point. Tags contain properties with values for customers to logically organize their Azure resources and they don’t affect the ledger or its properties.

For instance, the sample body uses the IsPreProduction tag which was present during the sample ledger creation. You may have a different tag.

To add another user client cert, "LedgerCertUsers" json array should have both the old and new cert in the request body. Similarly, to replace the old cert with the new one, the request body should have just the new cert.

1. Select Execute
Ledger Update API Request Body Sample - Replacing user cert and updating tags: 

```json
{
	"sku": "Standard",
	"location": "EastUS",
	"tags": {
		"IsProduction": "true"
	},
	"LedgerCertUsers": [{
		"cert": "-----BEGIN CERTIFICATE-----\nMIIBsTCCATigAwIBAgIUZS+LFyXciCNorqV0iQd442DpsScwCgYIKoZIzj0EAwMwEDEOMAwGA1UEAwwFdXNlcjAwHhcNMjAwNzEzMjIxODMwWhcNMjEwNzEzMjIxODMwWjAQMQ4wDAYDVQQDDAV1c2VyMDB2MBAGByqGSM49AgEGBSuBBAAiA2IABH0ccagmRk+aGlldCa/k5mWbrCZLqyUS3I58psmV1QDMCVyoQh3B4w3vbb81fz7OM56MIaU8Bg5nj9cBowoPfE+ygBuisjLl51IxvmTDxSgdNw4h1c7VxNKcrjhVe5+vF6NTMFEwHQYDVR0OBBYEFGnZkmxh4mZIC/tQm+rB8czF1JG7MB8GA1UdIwQYMBaAFGnZkmxh4mZIC/tQm+rB8czF1JG7MA8GA1UdEwEB/wQFMAMBAf8wCgYIKoZIzj0EAwMDZwAwZAIvHa6nCHmBCUSBDQXa9Ln3XBzs9itZWXIeDF918Ze7CXuzj+e+9OqmKZbTT2JLC9UCMQD5x0QHM23ygCMIxMIYzyf6FHr3xYCOck6mD7iJKPvrnx0CrkYFayVoj0BE3vWS03c=\n-----END CERTIFICATE-----",
		"LedgerPermission": "ReadOnly"
	}]
}
```

Ledger Update API Response Sample - Replacing user cert and updating tags: 

```json
{
	{
		"sku": "Standard",
		"LedgerProperties": {
			"LedgerName": "test-Ledger-2",
			"LedgerUri": "https://test-Ledger-2-33e01921-ppe.eastus.cloudapp.azure.com",
			"identityServiceUri": "https://identity.accLedger-ppe.azure.com/networkIdentity/test-Ledger-2-33e01921",
			"LedgerStorageAccount": "contosoLedger",
			"LedgerType": "Public",
			"LedgerCertUsers": [{
				"cert": "-----BEGIN CERTIFICATE-----\nMIIBsTCCATigAwIBAgIUZS+LFyXciCNorqV0iQd442DpsScwCgYIKoZIzj0EAwMwEDEOMAwGA1UEAwwFdXNlcjAwHhcNMjAwNzEzMjIxODMwWhcNMjEwNzEzMjIxODMwWjAQMQ4wDAYDVQQDDAV1c2VyMDB2MBAGByqGSM49AgEGBSuBBAAiA2IABH0ccagmRk+aGlldCa/k5mWbrCZLqyUS3I58psmV1QDMCVyoQh3B4w3vbb81fz7OM56MIaU8Bg5nj9cBowoPfE+ygBuisjLl51IxvmTDxSgdNw4h1c7VxNKcrjhVe5+vF6NTMFEwHQYDVR0OBBYEFGnZkmxh4mZIC/tQm+rB8czF1JG7MB8GA1UdIwQYMBaAFGnZkmxh4mZIC/tQm+rB8czF1JG7MA8GA1UdEwEB/wQFMAMBAf8wCgYIKoZIzj0EAwMDZwAwZAIvHa6nCHmBCUSBDQXa9Ln3XBzs9itZWXIeDF918Ze7CXuzj+e+9OqmKZbTT2JLC9UCMQD5x0QHM23ygCMIxMIYzyf6FHr3xYCOck6mD7iJKPvrnx0CrkYFayVoj0BE3vWS03c=\n-----END CERTIFICATE-----",
				"LedgerPermission": "ReadOnly"
			}]
		},
		"id": "string",
		"type": "Microsoft.ACCLedger/Ledgers",
		"location": "EastUS",
		"resourceGroup": "TestRG",
		"tags": {
			"IsProduction": "true"
		}
	}
```

Ledger Update API Request Body Sample - Adding another cert: 

```json
{
	"sku": "Standard",
	"location": "EastUS",
	"tags": {
		"IsPreProduction": "true"
	},
	"LedgerCertUsers": [{
		"cert": "-----BEGIN CERTIFICATE-----\nMIIBsTCCATigAwIBAgIUZS+LFyXciCNorqV0iQd442DpsScwCgYIKoZIzj0EAwMwEDEOMAwGA1UEAwwFdXNlcjAwHhcNMjAwNzEzMjIxODMwWhcNMjEwNzEzMjIxODMwWjAQMQ4wDAYDVQQDDAV1c2VyMDB2MBAGByqGSM49AgEGBSuBBAAiA2IABH0ccagmRk+aGlldCa/k5mWbrCZLqyUS3I58psmV1QDMCVyoQh3B4w3vbb81fz7OM56MIaU8Bg5nj9cBowoPfE+ygBuisjLl51IxvmTDxSgdNw4h1c7VxNKcrjhVe5+vF6NTMFEwHQYDVR0OBBYEFGnZkmxh4mZIC/tQm+rB8czF1JG7MB8GA1UdIwQYMBaAFGnZkmxh4mZIC/tQm+rB8czF1JG7MA8GA1UdEwEB/wQFMAMBAf8wCgYIKoZIzj0EAwMDZwAwZAIvHa6nCHmBCUSBDQXa9Ln3XBzs9itZWXIeDF918Ze7CXuzj+e+9OqmKZbTT2JLC9UCMQD5x0QHM23ygCMIxMIYzyf6FHr3xYCOck6mD7iJKPvrnx0CrkYFayVoj0BE3vWS03c=\n-----END CERTIFICATE-----",
		"LedgerPermission": "ReadOnly"
	}, {
		"cert": "-----BEGIN CERTIFICATE-----\nMIIBujCCAUCgAwIBAgIUdubtV9H+X0OObMkcMq1pAUbgOkkwCgYIKoZIzj0EAwMwFDESMBAGA1UEAwwJdXNlci1jZXJ0MB4XDTIwMDkwNDA3MjkwOVoXDTIxMDkwNDA3MjkwOVowFDESMBAGA1UEAwwJdXNlci1jZXJ0MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEi870SOiYOtogPgYKXjkDpUnlwTPGR5txU95alBTeCPJwoPD3v17XIae/XWUDAh3/XtDc+1wiNubR4z7l7ExBt1/E7xu4UcelApz/nEF95xtpilikwAT3knDLJmZRyDHNo1MwUTAdBgNVHQ4EFgQUvOcjvJM/86KNjvBbuc0gIlEQYIgwHwYDVR0jBBgwFoAUvOcjvJM/86KNjvBbuc0gIlEQYIgwDwYDVR0TAQH/BAUwAwEB/zAKBggqhkjOPQQDAwNoADBlAjEArfaybkoWb/D9EPeAeZv/vhz+zch0H3jhRYJSpYowLdpLC/N4tsHqNvAb9K8cVMMyAjBSYaoFiZmhGc7F7QSQiNOn/klCCVYr2H5BYUMYIoSRDo2W30zf9M+3BEr7uMMdtnQ=\n-----END CERTIFICATE-----",
		"ledgerPermission": "All"
	}]
}
```

Ledger Update API Response Sample - Adding another cert: 

```json
{
		"sku": "Standard", "LedgerProperties": {
			"LedgerName": "test-Ledger-2",
			"LedgerUri": "https://test-Ledger-2-33e01921-ppe.eastus.cloudapp.azure.com",
			"identityServiceUri": "https://identity.accLedger-ppe.azure.com/networkIdentity/test-Ledger-2-33e01921",
			"LedgerStorageAccount": "contosoLedger",
			"LedgerType": "Public",
			"LedgerCertUsers": [{
				"cert": "-----BEGIN CERTIFICATE-----\nMIIBsTCCATigAwIBAgIUZS+LFyXciCNorqV0iQd442DpsScwCgYIKoZIzj0EAwMwEDEOMAwGA1UEAwwFdXNlcjAwHhcNMjAwNzEzMjIxODMwWhcNMjEwNzEzMjIxODMwWjAQMQ4wDAYDVQQDDAV1c2VyMDB2MBAGByqGSM49AgEGBSuBBAAiA2IABH0ccagmRk+aGlldCa/k5mWbrCZLqyUS3I58psmV1QDMCVyoQh3B4w3vbb81fz7OM56MIaU8Bg5nj9cBowoPfE+ygBuisjLl51IxvmTDxSgdNw4h1c7VxNKcrjhVe5+vF6NTMFEwHQYDVR0OBBYEFGnZkmxh4mZIC/tQm+rB8czF1JG7MB8GA1UdIwQYMBaAFGnZkmxh4mZIC/tQm+rB8czF1JG7MA8GA1UdEwEB/wQFMAMBAf8wCgYIKoZIzj0EAwMDZwAwZAIvHa6nCHmBCUSBDQXa9Ln3XBzs9itZWXIeDF918Ze7CXuzj+e+9OqmKZbTT2JLC9UCMQD5x0QHM23ygCMIxMIYzyf6FHr3xYCOck6mD7iJKPvrnx0CrkYFayVoj0BE3vWS03c=\n-----END CERTIFICATE-----",
				"LedgerPermission": "ReadOnly"
			}, {
				"cert": "-----BEGIN CERTIFICATE-----\nMIIBujCCAUCgAwIBAgIUdubtV9H+X0OObMkcMq1pAUbgOkkwCgYIKoZIzj0EAwMwFDESMBAGA1UEAwwJdXNlci1jZXJ0MB4XDTIwMDkwNDA3MjkwOVoXDTIxMDkwNDA3MjkwOVowFDESMBAGA1UEAwwJdXNlci1jZXJ0MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEi870SOiYOtogPgYKXjkDpUnlwTPGR5txU95alBTeCPJwoPD3v17XIae/XWUDAh3/XtDc+1wiNubR4z7l7ExBt1/E7xu4UcelApz/nEF95xtpilikwAT3knDLJmZRyDHNo1MwUTAdBgNVHQ4EFgQUvOcjvJM/86KNjvBbuc0gIlEQYIgwHwYDVR0jBBgwFoAUvOcjvJM/86KNjvBbuc0gIlEQYIgwDwYDVR0TAQH/BAUwAwEB/zAKBggqhkjOPQQDAwNoADBlAjEArfaybkoWb/D9EPeAeZv/vhz+zch0H3jhRYJSpYowLdpLC/N4tsHqNvAb9K8cVMMyAjBSYaoFiZmhGc7F7QSQiNOn/klCCVYr2H5BYUMYIoSRDo2W30zf9M+3BEr7uMMdtnQ=\n-----END CERTIFICATE-----",
				"ledgerPermission": "All"
			}]
		}, "id": "string", "type": "Microsoft.ACCLedger/Ledgers", "location": "EastUS", "resourceGroup": "TestRG", "tags": {
			"IsPreProduction": "true"
		}
}
```

### Workflow 4: Delete a Confidential Ledger

This workflow shows how to delete an existing Confidential Ledger. A deleted Confidential Ledger cannot be recovered.

1. Open the [ACCL admin console](https://controlplane.accledger.azure.com/swagger)

    :::image type="content" source="./media/create-ledger-6.png" alt-text="Create Ledger screenshot 6":::

1. Select Delete → Try it out
1. Add all requested parameter values.
1. Select Execute

Ledger Delete API Response Sample: 

```bash
Ledger <ledgerName> Deleted.
```

## Functional Workflows

Functional APIs let your application code interact with the Ledger to perform append-only and read functions. Functional calls occur over a secure HTTPS/TLS connection that terminates inside the (hardware-based) enclave, which ensures confidentiality of the transactions and data sent to the Confidential Ledger. You can find further information about the client/server trust model in the FAQ section.
Getting started

Functional APIs/Workflow includes a python code sample that can be run on Windows10 or Ubuntu 18.04. Functional API code sample also relies on certain binaries (listed below) to be pre-installed on your test machine:

Option 1: Ubuntu 18.04 instructions
- Upgrade Python here
Option 2: Windows operating system instructions
a. Install Chocolatey instructions here
b. Install Python instructions here
c. Install OpenSSL instructions here

Our recommendation would be to use WSL Ubuntu 18.04 or Ubuntu 18.04. Please follow the below requirements before running the code sample.

> [!NOTE]
> Python is pre-installed on Ubuntu and WSL but please upgrade to Python 3.6 version or above and below Python 3.9 version. Steps to install the latest version of Python can be found [here](https://www.python.org/downloads/)

Client machine running CodeSample to access ledger API for Functional Workflows get authenticated by the process described here

### Additional Resources

Windows/Ubuntu 18.04/WSL 18.04, WSL is Windows Subsystem for Linux and can be installed from [here](/windows/wsl/install-win10). WSL Ubuntu instructions to set up your machine are same as Option 1 identified above Prerequisites
- LedgerUri sample here (this was returned as part of Ledger Provisioning response or using any of the Admin Get Ledger APIs.)
- Cert(s) created while deploying a new Ledger (this was added to an allowlist during Ledger Provisioning or Update)
- Code Sample downloaded on your machine.
- Code Sample has a requirements.txt. Please ensure to run it using: pip3 install -r requirements.txt
- Code Sample has a file called DataPlaneconfig.json. Please set it as below sample based on your values. An example of this config is shown below:

```json
{
	"data_plane": {
		"identity_service_uri": "https://identity.accledger-ppe.azure.com/networkIdentity/ledger-33e01921",
		"ledger_uri": "https://ledger-33e01921-ppe.eastus.cloudapp.azure.com"
	}
}
```

1. Run following command: 

```bash
python ConfidentialLedgerDataPlane.py --public-key "user_cert.pem" --private-key "user_privk.pem"
```

Note: This cert is on the allow list and is the one used when Ledger was created in the administrative workflow. This cert will be used for authenticating against Ledger APIs in following workflows.

### Workflow 1: Append single entry to Confidential Ledger

Variant 1: Append Data

This appending data operation does not wait for a response.
1. Enter command at prompt: `put`.
1. Enter your data at the prompt.

Response Sample:
 
```json
{
	"view": "2",
	"seq-no": "46",
	"body": "your_data"
}
```

Variant 2: Append Data With Wait For Commit

This variant operation waits for completion status to append data. This may take a few moments.

1. Enter command at prompt: `putWithCommit`
1. Enter your data at the prompt.
1. The prompt will get a status. You may view a Pending status while you wait. To continue, you may need to hit Enter to see a Committed status.

Response Sample: 

```json
{
	"view": "2",
	"seq-no": "46",
	"body": "your_data",
	"commit_status": "COMMITTED"
}
```

Variant 3: Put Data and Wait For Receipt

This operation posts the transaction to the ledger and waits for the transaction receipt to be available and gets it from the ledger service. Specifically, this receipt can be used by the users to prove that the transaction was posted to the ledger and that the ledger service has acknowledged that the transaction was committed. This receipt has Merkle Proof for the transaction and provides nonrepudiation guarantees.

1. Enter command at prompt: `putWithReceipt`
1. The prompt will display a receipt.

Response Sample:

```json
{
	"view": "2",
	"seq-no": "48",
	"body": "your_data",
	"receipt": [48 ","
		0 ","
		0 ","
		0 ","
		0 ","
		0 ","
		0 ","
		0 ","
		49 ","
		0 ","
		0 ","
		0 ","
		14 ","
		77 ","
		255 ","
		74 ","
		139 ","
		103 ","
		30 ","
		97 ","
		227 ","
		118 ","
		221 ","
		160 ","
		108 ","
		125 ","
		117 ","
		226 ","
		163 ","
		33 ","
		90 ","
		255 ","
		3 ","
		254 ","
		117 ","
		215 ","
		155 ","
		31 ","
		68 ","
		119 ","
		245 ","
		187 ","
		152 ","
		74 ","
		27 ","
		127 ","
		121 ","
		237 ","
		19 ","
		23 ","
		142 ","
		74 ","
		116 ","
		87 ","
		83 ","
		121 ","
		172 ","
		94 ","
		135 ","
		180 ","
		158 ","
		2 ","
		158 ","
		15 ","
		52 ","
		121 ","
		18 ","
		253 ","
		105 ","
		217 ","
		43 ","
		126 ","
		137 ","
		74 ","
		178 ","
		50 ","
		130 ","
		216 ","
		227 ","
		45 ","
		10 ","
		161 ","
		123 ","
		125 ","
		45 ","
		212 ","
		209 ","
		28 ","
		89 ","
		187 ","
		37 ","
		194 ","
		40 ","
		70 ","
		63 ","
		81 ","
		15 ","
		254 ","
		104 ","
		145 ","
		161 ","
		151 ","
		78 ","
		192 ","
		28 ","
		9 ","
		1 ","
		187 ","
		125 ","
		110 ","
		100 ","
		1 ","
		1 ","
		203 ","
		160 ","
		225 ","
		141 ","
		130 ","
		244 ","
		94 ","
		238 ","
		164 ","
		80 ","
		76 ","
		152 ","
		190 ","
		146 ","
		202 ","
		186 ","
		86 ","
		183 ","
		191 ","
		189 ","
		71 ","
		172 ","
		251 ","
		239 ","
		140 ","
		177 ","
		231
	]
}
```

Note: Tools to validate the receipt by the customer will be provided in a later iteration of Code Sample.

### Workflow 2: Append multiple entries to Confidential Ledger

There are two ways to add multiple entries to the Ledger via a batch API.

Variant 1: Batch Put Data Without Waiting

1. Enter command at prompt: `putBatch`.
1. Enter your batch data when prompted.
1. The batch data will have been added to the Ledger.

Response Sample:

```json
# Put a transaction without waiting for commit 
# Sample Transaction 
# Enter number of elements: 2 
# Enter your input for 0: 
# test0 
# Enter your input for 1: 
# test1 
{
	"batchInfo": [{
		"view": "2"
		"seq-no": "61",
		"body": "test0"
	}, {
		"view": "2"
		"seq-no": "63",
		"body": "test1"
	}]
}
```

Variant 2: Batch Put Data With Wait For Commit

1. Enter command at prompt: `putBatchWithCommit`
1. Enter your batch data at the prompt.
1. All the data which was part of the batch will be written to the ledger.

Response Sample: 

```json
# Put a transaction and wait for Commit 
# Sample Transaction 
# Enter number of elements: 2 
# Enter your input for 0: 
# test0 # Enter your input for 1: 
# test1 
{
	"batchInfo": [{
		"view": "2",
		"seq-no": "61",
		"body": "test0",
		"commit_status": "COMMITTED"
	}, {
		"view": "2",
		"seq-no": "63",
		"body": "test1",
		"commit_status": "COMMITTED"
	}]
}
```

### Workflow 3: Read single entry from Confidential Ledger

This is for reading data back from the Ledger, one piece at a time. It will get the last entry written to the ledger.

Variant 1: Get Most Recently Committed Data

1. Enter command at prompt: `get`.

Response Sample:

```json
{
	"view": "2",
	"seq-no": "63",
	"body": "test1"
}
```


Variant 2: Get Data By Commit

1. Enter command at prompt: `getByCommit`.
1. Please enter a valid view and seq-no when prompted. This view and seq no is the one you received in response header when you executed the put operation on the Ledger.

Note: This is a time consuming operation. You may need to wait a while.

Response Sample:

```json
# Please enter the view and seq no:
# view: 2
# Seqno: 63
Result: 
{
	"view": "2",
	"seq-no": "63",
	"body": "test1"
}
```

Workflow 4: Read multiple entries from Ledger

It is possible to query multiple entries from the Confidential Ledger, however it might take longer to get a response.

Batch Get

1. Enter command at prompt: `getByCommitBatch`.
1. Enter the batch view and seq-no at the prompts.

Response Sample:

```json
# Get By Batch CommitId
# Sample Transaction
# Enter number of elements: 2
# Enter your input for 0:
# view: 2
# seq - no: 61
# Enter your input for 1:
# view: 2
# seq - no: 63 Result: 
[{
	"view": "2",
	"seq-no": "61",
	"body": "test0"
	8
}, {
	"view": "2",
	"seq-no": "63",
	"body": "test1"
}]
```

## Next steps

- [Overview of Microsoft Azure Confidential Ledger](overview.md)
