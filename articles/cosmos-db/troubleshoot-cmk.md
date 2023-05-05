---
title: Cross Tenant CMK Troubleshooting Guide
description: Cross Tenant CMK Troubleshooting Guide
author: dileepraotv-github
ms.service: cosmos-db
ms.topic: how-to
ms.date: 12/25/2022
ms.author: turao
ms.custom: ignite-2022
ms.devlang: azurecli
---

# Cross Tenant CMK Troubleshooting Guide

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

## This article helps troubleshoot Cross Tenant CMK errors

**Public documentation links**

- [Cosmos DB Customer Managed Key Documentation:](./how-to-setup-customer-managed-keys.md)
- [Cosmos DB MSI Documentation:](./how-to-setup-managed-identity.md)

**Cosmos DB account is in revoke state**

- Was the Key Vault deleted?
  - if YES, recover the key vault from recycle bin.
- Is the Key Vault Key Disabled?
  - if YES, re-enable the key.
- Check Key Vault -\> Networking -\> Firewalls and virtual networks are set to either "Allow public access from all networks" or "Allow public access from specific virtual networks and IP addresses". If later is selected, check if Firewall allow-lists are configured correctly, and "Allow trusted Microsoft services to bypass this firewall" is selected.
- Check if Key Vault missing any of the Wrap/Unwrap/Get permission in the access policy following [Cosmos DB Customer Managed Key Documentation:](./how-to-setup-customer-managed-keys.md#add-an-access-policy)
  - If YES, regrant the access
- In case the Multi-Tenant App used in the default identity has been mistakenly deleted
  - If YES, follow [restore application documentation](..//active-directory/manage-apps/restore-application.md) to restore the Application.
- In case UserAssigned identity used in the default identity has been mistakenly deleted
  - If YES, since UserAssigned identity isn't recoverable once deleted. The customer needs to create new UserAssigned Identity to the db account, and then follow the exact same configuration steps during provision like set FedereatedCrdential with Multi-Tenant App. Finally, customer need to update the db account's default identity with the new UserAssigned identity.
    - Example:`` _az cosmosdb update --resource-group \<rg\> --name \<dbname\> --default-identity "UserAssignedIdentity=\<New\_UA\_Resource\_ID1\>&FederatedClientId=00000000-0000-0000-0000-000000000000"_.``
    - Customer also needs to clean the old UserAssigned identity from the Cosmos DB account which has been deleted in Azure. Sample command: ``az cosmosdb identity remove --resource-group \<rg\> --name \<dbname\> --identities \<OLD\_UA\_Resource\_ID\>``
  - Wait 1 hour to let the account recovery from Revoke State
  - Try to access the Cosmos DB data plane by making a SDK/REST API request or using Azure portal's Data Explorer to view a document.

## 1. Basic Control Plane Create/Update Error Cases

___________________________________
**1.1**
___________________________________
**Scenario** 

Customer creates a CMK db account via Azure CLI/ARM Template with Key Vault's Firewall configuration "Allow trusted Microsoft services to bypass this firewall" unchecked.

**Error Message**

``Database account creation failed. Operation Id: 00000000-0000-0000-0000-000000000000, Error: {\"error\":{\"code\":\"Forbidden\",\"message\":\"Client address is not authorized and caller was ignored **because bypass is set to None** \\r\\nClient address: xx.xx.xx.xx\\r\\nCaller: name=Unknown/unknown;appid=00000000-0000-0000-0000-000000000000;oid=00000000-0000-0000-0000-000000000000\\r\\nVault: mykeyvault;location=eastus\",\"innererror\":{\"code\":\" **ForbiddenByFirewall** \"}}}\r\nActivityId: 00000000-0000-0000-0000-000000000000, ``

**Status Code**

Forbidden (403)

**Root Cause**

Key Vault isn't correctly configured to allow VNet/Trusted Service Bypass. The provision detects that it can't access key vault therefore throw the error. |
| Mitigation | Go to Azure portal -\> Key Vault -\> Networking -\> Firewalls and virtual networks -\> Ensure "Allow public access from specific virtual networks and IP addresses" is selected and the "Allow trusted Microsoft services to bypass this firewall" is checked -\> Save

:::image type="content" source="./media/troubleshoot-cmk/nw-allow-public-access.png" alt-text="Network settings to allow public access.":::


___________________________________

**1.2**
___________________________________
**Scenario**

1. A customer attempts to create CMK account with a Key Vault Key Uri that doesn't exist in the tenant. 
2. A customer tries to create a Cross Tenant CMK account with db account and key vault in different tenant, however the customer forgot to include the "&FederatedClientId=\<00000000-0000-0000-0000-000000000000\>" in the default identity.

For example: *``az cosmosdb create -n mydb -g myresourcegroup --key-uri "https://myvault.vault.azure.net/keys/mykey" --assign-identity "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myuserassignedidentity" --default-identity "UserAssignedIdentity=/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myuserassignedidentity"``*

The "&FederatedClientId=\<00000000-0000-0000-0000-000000000000\>" is missing in the default identity. 

3. Customer tries creating a Cross Tenant CMK account with db account and key vault in different tenant with "&FederatedClientId=\<00000000-0000-0000-0000-000000000000\>" in the default identity. However, the multi-tenant app doesn't exist or has been deleted. 


**Error Message**

``Database account creation failed. Operation Id: 00000000-0000-0000-0000-000000000000, Error: Error contacting the Azure Key Vault resource. Please try again.``

**Status Code** 

ServiceUnavailable(503) 


**Root Cause** 

In Scenario 1:  Expected

In Scenario 2: the missing of “&FederatedClientId=<00000000-0000-0000-0000-000000000000>” make the system think the key vault is in the same tenant as the db account, however customer might not have such key vault with same name in the same tenant, which results in this error.

In Scenario 3: Expected as the Multi-tenant App is not there or deleted.


**Mitigation**

For Scenario 1: customer needs to follow Configure your azure key vault instance section on [ setup customer managed keys documentation](./how-to-setup-customer-managed-keys.md) to retrieve the Key Vault Key Uri

For Scenario 2: customer need to add the missing “&FederatedClientId=<00000000-0000-0000-0000-000000000000>” into the default identity.

For Scenario 3: customer need to use the correct FederatedClientId or restore the multi-tenant app using [restore application documentation](..//active-directory/manage-apps/restore-application.md)


___________________________________
**1.3**
___________________________________

**Scenario**

Customer tries creating/updating a CMK account with invalid Key Vault key URI. 

**Error Message**

``Provided KeyVaultKeyUri http://mykeyvault.vault1.azure2.net3/keys4/mykey is Invalid.
ActivityId: 00000000-0000-0000-0000-000000000000, Microsoft.Azure.Documents.Common/2.14.0 ``


**Status Code** 

BadRequest(400)

**Root Cause** 

The input Key Vault key URI is invalid.

**Mitigation**

Customer should follow [setup customer managed keys documentation](./how-to-setup-customer-managed-keys.md#generate-a-key-in-azure-key-vault)
to retrieve the correct Key Vault key URI from the portal. 

___________________________________
**1.4**
___________________________________

**Scenario**

1. A customer is trying to create a CMK account with “keyVaultKeyUri” while using API version less than "2019-12-12".
2. Customer updates the “keyVaultKeyUri” of a CMK account while using API version less than "2019-12-12".
3. Customer tries updating “keyVaultKeyUri” on existing CMK account with non-null “keyVaultKeyUri” into a null value. (Convert CMK account into Non-CMK account)


**Error Message**

``Updating KeyVaultKeyUri is not supported
ActivityId: 00000000-0000-0000-0000-000000000000``


**Status Code** 

BadRequest(400)

**Root Cause** 

1. customer using API version less than "2019-12-12" when updating the KeyVaultKeyUri.
2. Convert CMK account into Non-CMK account is currently not supported. 


**Mitigation**

N/A, not supported right now.

___________________________________
**1.5**
___________________________________

**Scenario**

A customer is trying to update the Cosmos DB CMK account which is in revoke state. Notice the customer’s update is neither updating default identity or assign/unassign managed service identity. 

**Error Message**

``No Update is allowed on Database Account with Customer Managed Key in Revoked Status
ActivityId: 00000000-0000-0000-0000-000000000000, Microsoft.Azure.Documents.Common/2.14.0``


**Status Code** 

BadRequest(400)

**Root Cause** 

During Revoke state, only updating default identity or assigning/unassigning managed service identity is allowed on the account. Other updates are forbidden until the db account recovers from the Revoke state.

**Mitigation**

Customer should follow “Key Vault Revoke State Troubleshooting guide” 
To regrant the key vault access

___________________________________
**1.6**
___________________________________

**Scenario**

A customer is trying to create a CMK db account with SystemAssigned as the default identity.  

Sample Command:
*``az cosmosdb create -n mydb -g myresourcegroup --key-uri "https://myvault.vault.azure.net/keys/mykey" --assign-identity "[system]" --default-identity "SystemAssignedIdentity&FederatedClientId=00000000-0000-0000-0000-000000000000" --backup-policy-type Continuous``*


**Error Message**

``Database account creation failed. Operation Id: 00000000-0000-0000-0000-000000000000, Error: Updating default identity not allowed. Cannot set SystemAssignedIdentity as the default identity during provision.
ActivityId: 00000000-0000-0000-0000-000000000000``


**Status Code** 

BadRequest(400)

**Root Cause** 

SystemAssigned identity as the default identity is currently not supported in the db account creation. SystemAssigned identity as the default identity is only supported in scenario when customer update the default identity to SystemAssignedidentity & and the key vault and the db account are in the same tenant. 

**Mitigation**

If a customer wants to create CMK account **with Continuous backup/ Synapse link / Full fidelity change feed / Materialized view enabled**, then UserAssigned identity is the only supported default identity right now. Notice that SystemAssignedIdentity as default identity is only supported in scenario when customer updates the default identity to SystemAssigned identity and the key vault and the db account must be in the same tenant. 

Sample Command for creation db account using UserAssigned identity.
(Refer to “Provision a Cross Tenant CMK account via UserAssigned Identity”)


___________________________________
**1.7**
___________________________________

**Scenario**

A customer is trying to update the KeyVaultKeyUri of an existing Cross Tenant CMK db account to a new key vault which has a different tenant from the old Key Vault. 

**Error Message**

``The tenant for the new Key Vault 00000000-0000-0000-0000-000000000000 does not match the one in the old Key Vault 00000000-0000-0000-0000-000000000001. New Key Vaults must be on the same tenant as the old ones.``

**Status Code** 

BadRequest(400)

**Root Cause** 

Once the default identity is set to Cross Tenant with “FedereatedClientId”, we only allow updating the Key Vault Key Uri to a new one which has the same tenant as the old one. We disallow update key vault key uri to a different tenant due to security reasons.

**Mitigation**

N/A, not supported


___________________________________
**1.8**
___________________________________

**Scenario**

Customer tries changing default identity from "UserAssignedIdentity=<UA_Resource_ID>&FederatedClientId=00000000-0000-0000-0000-000000000000" into "SystemAssignedIdentity&FederatedClientId=00000000-0000-0000-0000-000000000000" on an existing Cross Tenant CMK account.

**Error Message**

``Cross-tenant CMK is not supported with System Assigned identities as Default identities. Please use a User Assigned Identity instead.``

**Status Code** 

BadRequest(400)

**Root Cause** 

SystemAssigned identity isn't supported in Cross Tenant CMK scenario right now.

**Mitigation**

N/A, not supported

___________________________________
**1.9**
___________________________________

**Scenario**

•	A customer is trying to provision a cross tenant CMK account with FirstPartyIdentity as the default identity.

•	Customer tries changing default identity from "UserAssignedIdentity=<UA_Resource_ID>&FederatedClientId=00000000-0000-0000-0000-000000000000" into "FirstPartyIdentity" on an existing Cross Tenant CMK account.


**Error Message**

``Cross-tenant CMK is not supported with First Party identities as Default identities. Please use a User Assigned identity instead``

**Status Code** 

BadRequest(400)

**Root Cause** 

First Party Identity isn't supported in Cross Tenant CMK scenario right now

**Mitigation**

N/A, not supported

___________________________________

## 2. Data Plane Error Cases
___________________________________
**2.1**
___________________________________

**Scenario**

A customer is trying to query SQL documents /Table Entity/Graph Vertex via Cosmos DB DataPlane via SDK/DocumentDBStudio/Portal’s DataExplorer while the db account is in Revoke State. 

**Error Message**

``{"Errors":["Request is blocked due to Customer Managed Key not being accessible."]} ActivityId: 00000000-0000-0000-0000-000000000000, Request URI: /apps/00000000-0000-0000-0000-000000000000/services/00000000-0000-0000-0000-000000000000/partitions/00000000-0000-0000-0000-000000000000/replicas/1234567p/, RequestStats: Microsoft.Azure.Cosmos.Tracing.TraceData.ClientSideRequestStatisticsTraceDatum, SDK``

**Status Code** 

Forbidden (403)

**Root Cause** 

There could be multi reason that the db account go revoke state, refer to the “6 checks” of the “Key Vault Revoke State Troubleshooting guide”.

**Mitigation**

Customer should follow “Key Vault Revoke State Troubleshooting guide” to recovery from Revoke State. 

___________________________________
**2.2**
___________________________________

**Scenario**

A customer is trying to query Cassandra Row via Cosmos DB DataPlane via SDK/DocumentDBStudio/Portal’s DataExplorer while the db account is in Revoke State. 

**Error Message**

``{"readyState":4,"responseText":"","status":401,"statusText":"error"}``

**Status Code** 

Unauthorized (401)

**Root Cause** 

There could be multi reason that the db account go revoke state, refer to the “6 checks” of the “Key Vault Revoke State Troubleshooting guide”.

**Mitigation**

Customer should follow “Key Vault Revoke State Troubleshooting guide” to recovery from Revoke State.

___________________________________
**2.3**
___________________________________

**Scenario**

Customer trying to query Mongo API via Cosmos DB DataPlane via SDK/DocumentDBStudio/Portal’s DataExplorer while the db account is in Revoke State. 

**Error Message**

``Error querying documents: An exception occurred while opening a connection to the server., Payload: {<redacted>}``

**Status Code** 

Internal Server Error (500)

**Root Cause** 

There could be multi reason that the db account go revoke state, refer to the “six checks” of the “Key Vault Revoke State Troubleshooting guide”.

**Mitigation**

Customer should follow “Key Vault Revoke State Troubleshooting guide” to recovery from Revoke State. 

___________________________________
**2.4**
___________________________________

**Scenario**

Customer trying to create/modify collection/documents (or other naming depends on the API) via Cosmos DB DataPlane via SDK/DocumentDBStudio/Portal’s DataExplorer while the db account is in Revoke State.

**Error Message**

``Request timed out.``

**Status Code** 

Request Timeout (408)

**Root Cause** 

There could be multi reason that the db account go revoke state, refer to the “six checks” of the “Key Vault Revoke State Troubleshooting guide”.

**Mitigation**

Customer should follow “Key Vault Revoke State Troubleshooting guide” to recovery from Revoke State.

___________________________________

## 3. Cosmos DB Cross Tenant CMK with Continuous backup / Azure Synapse Link / Full fidelity change feed / Materialized View

___________________________________
**3.1**
___________________________________

**Scenario**

1. Customers try creating a db account with both Continuous backup mode and multiple write locations enabled 
2. Customers try enabling Continuous backup mode on existing db account with multiple write locations enabled 
3. Customers try enabling multiple write locations on existing db account with Continuous backup mode enabled. 


**Error Message**

``Continuous backup mode and multiple write locations cannot be enabled together for a global database account
ActivityId: 00000000-0000-0000-0000-000000000000``


**Status Code** 

BadRequest(400)

**Root Cause** 

Continuous backup mode and multiple write locations cannot be enabled together

**Mitigation**

N/A, not supported right now.

___________________________________
**3.2**
___________________________________

**Scenario**

1. Customer creates a CMK db account with Continuous backup / Azure Synapse Link / Full fidelity change feed / Materialized view with First Party Identity as the default identity. 
2. Customer enables Continuous backup / Azure Synapse Link / Full fidelity change feed / Materialized view on an existing account with First Party as the default identity. 

Sample Command:
*``az cosmosdb create -n mydb -g myresourcegroup --key-uri "https://myvault.vault.azure.net/keys/mykey" --assign-identity "[system]" --default-identity "FirstPartyIdentity" --backup-policy-type Continuous``*


**Error Message**

``Setting Non-FPI default identity is required for dedicated storage account features. Please set a valid System or User Assigned Identity to default and retry the request.\r\nActivityId: 00000000-0000-0000-0000-000000000000``

**Status Code** 

BadRequest(400)

**Root Cause** 

The Continuous backup / Azure Synapse Link / Full fidelity change feed / Materialized view features requires dedicated storage account, which doesn’t support FirstPartyIdentity as the default identity.

**Mitigation**

If customer wants to create CMK account with **Continuous backup/ Synapse link / Full fidelity change feed / Materialized view enabled**, then UserAssigned identity is the only supported default identity right now. Notice the SystemAssignedIdentity as default identity is only supported in scenario when customer update the default identity to SystemAssigned identity & and the key vault and the db account must be in the same tenant. 

Sample Command for creation db account using UserAssigned identity.
``az cosmosdb create -n mydb -g myresourcegroup --key-uri "https://myvault.vault.azure.net/keys/mykey" --assign-identity "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myuserassignedidentity" --default-identity "UserAssignedIdentity=/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myuserassignedidentity&FederatedClientId=00000000-0000-0000-0000-000000000000"``


___________________________________
**3.3**
___________________________________

**Scenario**

Customer tries enabling CMK on existing non-cmk account with Continuous backup / Synapse link / Full fidelity change feed / Materialized view already enabled. 

**Error Message**

``Customer Managed Key enablement on an existing Analytical Store/Continuous Backup/Materialized View/Full Fidelity Change Feed enabled Account is not supported ActivityId: 00000000-0000-0000-0000-000000000000``

**Status Code** 

BadRequest(400)

**Root Cause** 

Enabling CMK on existing non-cmk account with Continuous backup / Azure Synapse Link / Full fidelity change feed / Materialized view already enabled is currently under development and not supported yet. 

**Mitigation**

N/A, not supported right now.

___________________________________
**3.4**
___________________________________

**Scenario**

Customer tries turn off Azure Synapse Link (Also called analytical storage) on existing db accounts that has Azure Synapse Link already enabled.

**Error Message**

``EnableAnalyticalStorage cannot be disabled once it is enabled on an account.\r\nActivityId: 00000000-0000-0000-0000-000000000000, Microsoft.Azure.Documents.Common/2.14.0``

**Status Code** 

BadRequest(400)

**Root Cause** 

Today, Azure Synapse Link once turned on, cannot be turned off.

**Mitigation**

N/A, not supported right now.

___________________________________
**3.5**
___________________________________

**Scenario**

Customer tries turn off Continuous backup mode (Also called PITR) on existing db accounts that has Continuous backup mode already enabled.

**Error Message**

``Continuous backup mode cannot be disabled once it is enabled on the account.\\r\\nActivityId: 00000000-0000-0000-0000-000000000000, Microsoft.Azure.Documents.Common/2.14.0\``

**Status Code** 

BadRequest(400)

**Root Cause** 

Today, Continuous backup mode once turned on, cannot be turned off.

**Mitigation**

N/A, not supported right now.

___________________________________
**3.6**
___________________________________

**Scenario**

Customer tries to turn off Materialized View on existing db accounts which has Materialized View already enabled.

**Error Message**

``EnableMaterializedViews cannot be disabled once it is enabled on an account.\r\nActivityId: 00000000-0000-0000-0000-000000000000``

**Status Code** 

BadRequest(400)

**Root Cause** 

Today, Materialized View once turned on, cannot be turned off.

**Mitigation**

N/A, not supported right now.

___________________________________
**3.7**
___________________________________

**Scenario**

Customers try to enable continuous backup mode with any other properties. 
For example: 
*``az cosmosdb update -n mydb -g myresourcegroup --backup-policy-type Continuous --enable-analytical-storage``*


**Error Message**

``Cannot update continuous backup mode and other properties at the same time.
ActivityId: 00000000-0000-0000-0000-000000000000``


**Status Code** 

BadRequest(400)

**Root Cause** 

Enable continuous backup mode with any other properties on existing account is not supported. 


**Mitigation**

Enable continuous backup mode without any other properties on existing account.

___________________________________
**3.8**
___________________________________

**Scenario**

Customer tries creating a CMK account with both continuous backup (also called PITR) and Azure Synapse Link (also called analytical storage) enabled. 

**Error Message**

``Continuous backup mode cannot be enabled together with Storage Analytics feature.``

**Status Code** 

BadRequest(400)

**Root Cause** 

Continuous backup (also called PITR) and Azure Synapse Link (also called analytical storage) cannot be enabled during creation at the same time. However, customer can enable Azure Synapse Link on an existing db account with Continuous backup enabled.

**Mitigation**

N/A, not supported right now.

___________________________________
**3.9**
___________________________________

**Scenario**

Customer tries creating CMK account with Full Fidelity Change Feed enabled. 

**Error Message**

``Customer Managed Key and Full Fidelity Change Feed cannot be enabled together for a global database account\r\nActivityId: 00000000-0000-0000-0000-000000000000``

**Status Code** 

BadRequest(400)

**Root Cause** 

Customer Managed Key and Full Fidelity Change Feed cannot be enabled together for a global database account today.

**Mitigation**

N/A, not supported right now.

___________________________________
**3.10**
___________________________________

**Scenario**

Customer tries enabling Materialized View on an existing db account with continuous backup mode already enabled.

**Error Message**

``Cannot enable Materialized View when continuous backup mode is already enabled.\r\nActivityId: 00000000-0000-0000-0000-000000000000``

**Status Code** 

BadRequest(400)

**Root Cause** 

enable Materialized View when continuous backup mode is already enabled is not supported.

**Mitigation**

N/A, not supported right now.

___________________________________
**3.11**
___________________________________

**Scenario**

Customer tries enabling continuous backup mode on an existing account with Materialized View enabled.

**Error Message**

``Cannot enable continuous backup mode when Materialized View is already enabled.\r\nActivityId: 00000000-0000-0000-0000-000000000000``

**Status Code** 

BadRequest(400)

**Root Cause** 

Cannot enable continuous backup mode when Materialized View is already enabled 

**Mitigation**

N/A, not supported right now.

___________________________________
**3.12**
___________________________________

**Scenario**

Customer tries enabling full fidelity change feed on an existing account with Materialized View enabled.

**Error Message**

``Cannot enable full fidelity change feed when materialized view is already enabled.\r\nActivityId: 00000000-0000-0000-0000-000000000000``

**Status Code** 

BadRequest(400)

**Root Cause** 

Cannot enable full fidelity change feed when materialized view is already enabled


**Mitigation**

N/A, not supported right now.

___________________________________

## 4. Cosmos DB Multi-API compatibility with Continuous backup / Azure Synapse Link / Full fidelity change feed / Materialized view Error Cases

___________________________________
**4.1**
___________________________________

**Scenario**

1. Provision Mongo/Gremlin/Table CMK db accounts with Materialized Views enabled.
2. Enable MaterializedViews on a Mongo/Gremlin/Table CMK db accounts.


**Error Message**

``MaterializedViews is not supported on this account type.\r\nActivityId: 00000000-0000-0000-0000-000000000000``

**Status Code** 

BadRequest(400)

**Root Cause** 

Only SQL and Cassandra API mode are compatible with Materialized View. The Mongo, Gremlin, Table API aren't supported right now. 

**Mitigation**

1. Provision a CMK db account with Materialized Views enabled with only SQL and Cassandra API.
2. Enable Materialized Views on a CMK account with only SQL and Cassandra API.


___________________________________
**4.2**
___________________________________

**Scenario**

1. Customer creates a CMK db account using Cassandra API with Continuous backup mode enabled.
2. Customer enables Continuous backup mode on a CMK db account using Cassandra API.


**Error Message**

``Continuous backup mode cannot be enabled together with Cassandra database account\r\nActivityId: e2b1b7c8-211a-4fa5-bd9c-253e6c65d6f0, Microsoft.Azure.Documents.Common/2.14.0``

**Status Code** 

BadRequest(400)

**Root Cause** 

Continuous backup mode cannot be enabled together with Cassandra database

**Mitigation**

N/A, Not supported as of today.

___________________________________
**4.3**
___________________________________

**Scenario**

1. Customer tries creating db account with both with Gremlin V1 and Continuous backup mode enabled.
1. Customer tries enabling Continuous backup mode on existing db account with Gremlin API.


**Error Message**

``Continuous backup mode cannot be enabled together with Gremlin V1 enabled database account\\r\\nActivityId: 00000000-0000-0000-0000-000000000000``

**Status Code** 

BadRequest(400)

**Root Cause** 

Continuous backup mode cannot be enabled together with Gremlin V1 account right now.


**Mitigation**

Expected behavior.

___________________________________
**4.4**
___________________________________

**Scenario**

1. Customer tries creating db account with both with Table API and Continuous backup mode enabled.
1. Customer tries enabling Continuous backup mode on existing db account with Table API.


**Error Message**

``Continuous backup mode cannot be enabled together with table enabled database account\\r\\nActivityId: 00000000-0000-0000-0000-000000000000``

**Status Code** 

BadRequest(400)

**Root Cause** 

Continuous backup mode cannot be enabled together with table enabled database account.

**Mitigation**

Expected behavior.

___________________________________

## 5. Azure Synapse Link Error Cases

___________________________________
**5.1**
___________________________________

**Scenario**

Customer trying to use Azure Synapse Link to query data from a Cosmos DB CMK account with Azure Synapse Link enabled, however at the same the key vault access is lost.

For example, customer tries using Azure synapse studio’s Spark Notebook to query Cosmos DB data via Azure Synapse Link, and at the same time customer has removed the current default identity’s “GET/WRAP/Unwrap” permission from the Key Vault access policy for a while. 


**Error Message**

```
Py4JJavaError                             Traceback (most recent call last)
<ipython-input-30-668efb4> in <module>
----> 1 df = spark.read.format("cosmos.olap").option("spark.synapse.linkedService", "CosmosDb1").option("spark.cosmos.container", "cc").load()
      2 
      3 display(df.limit(10))

/opt/spark/python/lib/pyspark.zip/pyspark/sql/readwriter.py in load(self, path, format, schema, **options)
    162             return self._df(self._jreader.load(self._spark._sc._jvm.PythonUtils.toSeq(path)))
    163         else:
--> 164             return self._df(self._jreader.load())
    165 
    166     def json(self, path, schema=None, primitivesAsString=None, prefersDecimal=None,

~/cluster-env/env/lib/python3.8/site-packages/py4j/java_gateway.py in __call__(self, *args)
   1319 
   1320         answer = self.gateway_client.send_command(command)
-> 1321         return_value = get_return_value(
   1322             answer, self.gateway_client, self.target_id, self.name)
   1323 

/opt/spark/python/lib/pyspark.zip/pyspark/sql/utils.py in deco(*a, **kw)
    109     def deco(*a, **kw):
    110         try:
--> 111             return f(*a, **kw)
    112         except py4j.protocol.Py4JJavaError as e:
    113             converted = convert_exception(e.java_exception)

~/cluster-env/env/lib/python3.8/site-packages/py4j/protocol.py in get_return_value(answer, gateway_client, target_id, name)
    324             value = OUTPUT_CONVERTER[type](answer[2:], gateway_client)
    325             if answer[1] == REFERENCE_TYPE:
--> 326                 raise Py4JJavaError(
    327                     "An error occurred while calling {0}{1}{2}.\n".
    328                     format(target_id, ".", name), value)

Py4JJavaError: An error occurred while calling o1292.load.
: org.apache.hadoop.fs.azure.AzureException: java.util.NoSuchElementException: An error occurred while enumerating the result, check the original exception for details.
	at org.apache.hadoop.fs.azure.AzureNativeFileSystemStore.retrieveMetadata(AzureNativeFileSystemStore.java:2223)
...
**Caused by: com.microsoft.azure.storage.StorageException: The key vault key is not found to unwrap the encryption key.**
	at com.microsoft.azure.storage.StorageException.translateException(StorageException.java:87)
	at com.microsoft.azure.storage.core.StorageRequest.materializeException(StorageRequest.java:315)
	at com.microsoft.azure.storage.core.ExecutionEngine.executeWithRetry(ExecutionEngine.java:185)
	at com.microsoft.azure.storage.core.LazySegmentedIterator.hasNext(LazySegmentedIterator.java:109)
  
  ```
**Status Code** 

BadRequest(400)

**Root Cause** 

As customer has removed the current default identity’s “GET/WRAP/Unwrap” permission from the Key Vault access policy for a while, both Cosmos DB account and the dedicated storage account no longer able to access the key vault and will go to revoke state. The Azure Synapse Link will query data from the dedicated storage account, which is in revoke state: 
“Caused by: com.microsoft.azure.storage.StorageException: The key vault key is not found to unwrap the encryption key.”


**Mitigation**

Customer should follow “Key Vault Revoke State Troubleshooting guide” to regrant key vault access. 

___________________________________
