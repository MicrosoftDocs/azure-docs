---
title: Grant permissions to users and client applications using CLI and REST API - Azure Health Data Services
description: This article describes how to grant permissions to users and client applications using CLI and REST API.
services: healthcare-apis
author: chachachachami
ms.service: healthcare-apis
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 06/06/2022
ms.author: chrupa
---

# Configure Azure RBAC role using Azure CLI and REST API

In this article, you'll learn how to grant permissions to client applications (and users) to access Azure Health Data Services using Azure Command-Line Interface (CLI) and REST API. This step is referred to as "role assignment" or Azure 
[role-based access control (Azure RBAC role)](./../role-based-access-control/role-assignments-cli.md). To further your understanding about the application roles defined for Azure Health Data Services, see [Configure Azure RBAC role](configure-azure-rbac.md).

You can view and download the [CLI scripts](https://github.com/microsoft/healthcare-apis-samples/blob/main/src/scripts/role-assignment-using-cli.http) and [REST API scripts](https://github.com/microsoft/healthcare-apis-samples/blob/main/src/scripts/role-assignment-using-rest-api.http) from [Azure Health Data Services samples](https://github.com/microsoft/healthcare-apis-samples).

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

### Azure Health Data Services role assignment

The role assignments for Azure Health Data Services require the following values.

- Application role name or GUID ID.
- Service principal ID for the user or client application.
- Scope for the role assignment, that is, the Azure Health Data Services service instance. It includes subscription, resource group, workspace name, and FHIR or DICOM service name. You can use the absolute or relative URL for the scope. Note that "/" isn’t added at the beginning of the relative URL.

```
#Azure Health Data Services role assignment
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

You can verify the role assignment status from the command-line response or in the Azure portal.

### Azure API for FHIR role assignment

Role assignments for Azure API for FHIR work similarly. The difference is that the scope contains the FHIR service only and the workspace name isn’t required.

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
- Scope for Azure Health Data Services to which you grant access permissions. It includes subscription ID, resource group name, and the FHIR or DICOM service instance name.
- Role definition ID for roles such as "FHIR Data Contributor" or "DICOM Data Owner". Use `az role definition list --name "<role name>"` to list the role definition IDs.
- Service principal ID for the user or the client application.
- Microsoft Entra access token to the `https://management.azure.com/`, not Azure Health Data Services. You can get the access token using an existing tool or using Azure CLI command, `az account get-access-token --resource  "https://management.azure.com/"`
- For Azure Health Data Services, the scope includes workspace name and FHIR/DICOM service instance name.

```rest
### Create a role assignment - Azure Health Data Services (DICOM)
@roleassignmentid=xxx
@roleapiversion=2021-04-01
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

```rest
### Create a role assignment - Azure API for FHIR
@roleassignmentid=xxx
@roleapiversion=2021-04-01
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

## List service instances of Azure Health Data Services

Optionally, you can get a list of Azure Health Data Services services, or Azure API for FHIR. Note that the API version is based on Azure Health Data Services, not the version for the role assignment REST API.

For Azure Health Data Services, specify the subscription ID, resource group name, workspace name, FHIR or DICOM services, and the API version.

```rest
### Get Azure Health Data Services DICOM services
@apiversion=2021-06-01
@subscriptionid=xxx
@resourcegroupname=xxx
@workspacename=xxx

GET  https://management.azure.com/subscriptions/{{subscriptionid}}/resourceGroups/{{resourcegroupname}}/providers/Microsoft.HealthcareApis/workspaces/{{workspacename}}/dicomservices?api-version={{apiversion}}
Authorization: Bearer {{token}}
Content-Type: application/json
Accept: application/json

```

For Azure API for FHIR, specify the subscription ID and the API version.
 
```rest
### Get a list of Azure API for FHIR services
@apiversion=2021-06-01
@subscriptionid=xxx

GET  https://management.azure.com/subscriptions/{{subscriptionid}}/providers/Microsoft.HealthcareApis/services?api-version={{apiversion}}
Authorization: Bearer {{token}}
Content-Type: application/json
Accept: application/json

```

Now that you've granted proper permissions to the client application, you can access Azure Health Data Services in your applications.

## Next steps

In this article, you learned how to grant permissions to client applications using Azure CLI and REST API. For information on how to access Azure Health Data Services using the REST Client Extension in Visual Studio Code, see 

>[!div class="nextstepaction"]
>[Access using REST Client](./fhir/using-rest-client.md) 

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
