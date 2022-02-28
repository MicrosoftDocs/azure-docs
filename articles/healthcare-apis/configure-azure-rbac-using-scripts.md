---
title: Grant permissions to users and client applications using CLI and REST API - Azure Healthcare APIs
description: This article describes how to grant permissions to users and client applications using CLI and REST API.
services: healthcare-apis
author: SteveWohl
ms.service: healthcare-apis
ms.topic: tutorial
ms.date: 01/06/2022
ms.author: zxue
---

# Configure Azure RBAC Using Azure CLI and REST API

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you'll learn how to grant permissions to client applications (and users) to access Healthcare APIs using Azure Command-Line Interface (CLI) and REST API. This step is referred to as "role assignment" or Azure 
[role-based access control (Azure RBAC)](./../role-based-access-control/role-assignments-cli.md). To further your understanding about the application roles defined for Healthcare APIs, see [Configure Azure RBAC](configure-azure-rbac.md).

You can view and download the [CLI scripts](https://github.com/microsoft/healthcare-apis-samples/blob/main/src/scripts/role-assignment-using-cli.http) and [REST API scripts](https://github.com/microsoft/healthcare-apis-samples/blob/main/src/scripts/role-assignment-using-rest-api.http) from [Healthcare APIs Samples](https://github.com/microsoft/healthcare-apis-samples).

> [!Note] 
> To perform the role assignment operation, the user (or the client application) must be granted with RBAC permissions. Contact your Azure subscription administrators for assistance.

## Role assignments with CLI

You can list application roles using role names or GUID IDs. Include the role name in double quotes when there are spaces in it. For more information, see
[List Azure role definitions](./../role-based-access-control/role-definitions-list.md#azure-cli).

```
az role definition list --name "FHIR Data Contributor"
az role definition list --name 5a1fc7df-4bf1-4951-a576-89034ee01acd
az role definition list --name "DICOM Data Owner"
az role definition list --name 58a3b984-7adf-4c20-983a-32417c86fbc8
```

### Healthcare APIs role assignment

The role assignments for Healthcare APIs require the following values.

- Application role name or GUID ID.
- Service principal ID for the user or client application.
- Scope for the role assignment, that is, the Healthcare APIs service instance. It includes subscription, resource group, workspace name, and FHIR or DICOM service name. You can use the absolute or relative URL for the scope. Note that "/" is not added at the beginning of the relative URL.

```
#healthcare apis role assignment
fhirrole="FHIR Data Contributor"
dicomrole="DICOM Data Owner"
clientid=xxx
subscriptionid=xxx
resourcegroupname=xxx
workspacename=xxx
fhirservicename=xxx
dicomservicename=xxx
fhirrolescope="subscriptions/$subscriptionid/resourceGroups/$resourcegroupname/providers/Microsoft.HealthcareApis/workspaces/$workspacename/fhirservices/$fhirservicename"
dicomrolescope="subscriptions/$subscriptionid/resourceGroups/$resourcegroupname/providers/Microsoft.HealthcareApis/workspaces/$workspacename/dicomservices/$dicomservicename"

#find client app service principal id
spid=$(az ad sp show --id $clientid --query objectId --output tsv)

#assign the specified role
az role assignment create --assignee-object-id $spid --assignee-principal-type ServicePrincipal --role "$fhirrole" --scope $fhirrolescope
az role assignment create --assignee-object-id $spid --assignee-principal-type ServicePrincipal --role "$dicomrole" --scope $dicomrolescope
```

You can verify the role assignment status from the command line response or in the Azure portal.

### Azure API for FHIR role assignment

Role assignments for Azure API for FHIR work similarly. The difference is that the scope contains the FHIR service only and the workspace name is not required.

```
#azure api for fhir role assignment
fhirrole="FHIR Data Contributor"
clientid=xxx
subscriptionid=xxx
resourcegroupname=xxx
fhirservicename=xxx
fhirrolescope="subscriptions/$subscriptionid/resourceGroups/$resourcegroupname/providers/Microsoft.HealthcareApis/services/$fhirservicename"

#find client app service principal id
spid=$(az ad sp show --id $clientid --query objectId --output tsv)

#assign the specified role
az role assignment create --assignee-object-id $spid --assignee-principal-type ServicePrincipal --role "$fhirrole" --scope $fhirrolescope
```
## Role assignments with REST API

Alternatively, you can send a Put request to the role assignment REST API directly. For more information, see [Assign Azure roles using the REST API](./../role-based-access-control/role-assignments-rest.md).

>[!Note]
>The REST API scripts in this article are based on the [REST Client](./fhir/using-rest-client.md) extension. You'll need to revise the variables if you are in a different environment.

The API requires the following values:

- Assignment ID, which is a GUID value that uniquely identifies the transaction. You can use tools such as Visual Studio or Visual Studio Code extension to get a GUID value. Also, you can use online tools such as [UUID Generator](https://www.uuidgenerator.net/api/guid) to get it.
- API version that is supported by the API.
- Scope for the Healthcare APIs to which you grant access permissions. It includes subscription ID, resource group name, and the FHIR or DICOM service instance name.
- Role definition ID for roles such as "FHIR Data Contributor" or "DICOM Data Owner". Use `az role definition list --name "<role name>"` to list the role definition IDs.
- Service principal ID for the user or the client application.
- Azure AD access token to the [management resource](https://management.azure.com/), not the Healthcare APIs. You can get the access token using an existing tool or using Azure CLI command, `az account get-access-token --resource  "https://management.azure.com/"`
- For Healthcare APIs, the scope includes workspace name and FHIR/DICOM service instance name.

```
### Create a role assignment - Healthcare APIs (DICOM)
@roleassignmentid=xxx
@roleapiversion=2021-04-01-preview
@roledefinitionid=58a3b984-7adf-4c20-983a-32417c86fbc8
dicomservicename-xxx
@scope=/subscriptions/{{subscriptionid}}/resourceGroups/{{resourcegroupname}}/providers/Microsoft.HealthcareApis/workspaces/{{workspacename}}/dicomservices/{{dicomservicename}}
#get service principal id
@spid=xxx
#get access token
@token=xxx

PUT https://management.azure.com/{{scope}}/providers/Microsoft.Authorization/roleAssignments/{{roleassignmentid}}?api-version={{roleapiversion}}
Authorization: Bearer {{token}}
Content-Type: application/json
Accept: application/json

{
  "properties": {
    "roleDefinitionId": "/subscriptions/{{subscriptionid}}/providers/Microsoft.Authorization/roleDefinitions/{{roledefinitionid}}",
    "principalId": "{{spid}}"
  }
}
```

For Azure API for FHIR, the scope is defined slightly differently as it supports the FHIR service only, and no workspace name is required.

```
### Create a role assignment - Azure API for FHIR
@roleassignmentid=xxx
@roleapiversion=2021-04-01-preview
@roledefinitionid=5a1fc7df-4bf1-4951-a576-89034ee01acd
fhirservicename-xxx
@scope=/subscriptions/{{subscriptionid}}/resourceGroups/{{resourcegroupname}}/providers/Microsoft.HealthcareApis/services/{{fhirservicename}}
#get service principal id
@spid=xxx
#get access token
@token=xxx

PUT https://management.azure.com/{{scope}}/providers/Microsoft.Authorization/roleAssignments/{{roleassignmentid}}?api-version={{roleapiversion}}
Authorization: Bearer {{token}}
Content-Type: application/json
Accept: application/json

{
  "properties": {
    "roleDefinitionId": "/subscriptions/{{subscriptionid}}/providers/Microsoft.Authorization/roleDefinitions/{{roledefinitionid}}",
    "principalId": "{{spid}}"
  }
}
```

## List service instances of Healthcare APIs

Optionally, you can get a list of Healthcare APIs services, or Azure API for FHIR. Note that the API version is based on Healthcare APIs, not the version for the role assignment REST API.

For Healthcare APIs, specify the subscription ID, resource group name, workspace name, FHIR or DICOM services, and the API version.

```
### Get Healthcare APIs DICOM services
@apiversion=2021-06-01-preview
@subscriptionid=xxx
@resourcegroupname=xxx
@workspacename=xxx

GET  https://management.azure.com/subscriptions/{{subscriptionid}}/resourceGroups/{{resourcegroupname}}/providers/Microsoft.HealthcareApis/workspaces/{{workspacename}}/dicomservices?api-version={{apiversion}}
Authorization: Bearer {{token}}
Content-Type: application/json
Accept: application/json

```

For Azure API for FHIR, specify the subscription ID and the API version.
 
```
### Get a list of Azure API for FHIR services
@apiversion=2021-06-01-preview
@subscriptionid=xxx

GET  https://management.azure.com/subscriptions/{{subscriptionid}}/providers/Microsoft.HealthcareApis/services?api-version={{apiversion}}
Authorization: Bearer {{token}}
Content-Type: application/json
Accept: application/json

```

Now that you've granted proper permissions to the client application, you can access the Healthcare APIs in your applications.

## Next steps

In this article, you learned how to grant permissions to client applications using Azure CLI and REST API. For information on how to access Healthcare APIs, see 

>[!div class="nextstepaction"]
>[Access using Rest Client](./fhir/using-rest-client.md) 
