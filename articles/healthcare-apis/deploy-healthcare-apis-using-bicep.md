---
title: How to create Azure Health Data Services, workspaces, FHIR and DICOM service, and MedTech service using Azure Bicep
description: This document describes how to deploy Azure Health Data Services using Azure Bicep.
author: chachachachami
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 06/06/2022
ms.author: chrupa
ms.custom: mode-api, devx-track-bicep
---

# Deploy Azure Health Data Services using Azure Bicep

In this article, you'll learn how to create Azure Health Data Services, including workspaces, FHIR services, DICOM services, and MedTech service using Azure Bicep. You can view and download the Bicep scripts used in this article in [Azure Health Data Services samples](https://github.com/microsoft/healthcare-apis-samples/blob/main/src/templates/ahds.bicep). 

## What is Azure Bicep

Bicep is built on top of Azure Resource Manager (ARM) template. Bicep immediately supports all preview and generally available (GA) versions for Azure services, including Azure Health Data Services. During development, you can generate a JSON ARM template file using the `az bicep build` command. Conversely, you can decompile the JSON files to Bicep using the `az bicep decompile` command. During deployment, the Bicep CLI converts a Bicep file into an ARM template JSON.

You can continue to work with JSON ARM templates, or use Bicep to develop your ARM templates. For more information on Bicep, see [What is Bicep](../azure-resource-manager/bicep/overview.md).

>[!Note]
>The templates and scripts in the article are tested in Visual Studio Code during the public preview. Some changes may be necessary to adapt the code to run in your environment.

## Define parameters and variables

Using Bicep parameters and variables instead of hard coding names and other values allows you to debug and reuse your Bicep templates.

We first define parameters with the keyword *param* for workspace, FHIR service, DICOM service, MedTech service. Also, we define parameters for Azure subscription and Azure Active Directory (Azure AD) tenant. They’re used in the CLI command line with the "--parameters" option.

We then define variables for resources with the keyword *var*. Also, we define variables for properties such as the authority and the audience for the FHIR service. They’re specified and used internally in the Bicep template, and can be used in combination of parameters, Bicep functions, and other variables. Unlike parameters, they aren’t used in the CLI command line.

It's important to note that one Bicep function and environment(s) are required to specify the log in URL, `https://login.microsoftonline.com`. For more information on Bicep functions, see [Deployment functions for Bicep](../azure-resource-manager/bicep/bicep-functions-deployment.md#environment).

```
//Define parameters
param workspaceName string
param fhirName string
param dicomName string
param medtechName string
param tenantId string
param location string

//Define variables
var fhirservicename = '${workspaceName}/${fhirName}'
var dicomservicename = '${workspaceName}/${dicomName}'
var medtechservicename = '${workspaceName}/${medtechName}'
var medtechdestinationname = '${medtechservicename}/output1'
var loginURL = environment().authentication.loginEndpoint
var authority = '${loginURL}${tenantId}'
var audience = 'https://${workspaceName}-${fhirName}.fhir.azurehealthcareapis.com'
```

## Create a workspace template

To define a resource, use the keyword *resource*. For the workspace resource, the required properties include the workspace name and location. In the template, the location of the resource group is used, but you can specify a different value for the location. For the resource name, you can reference the defined parameter or variable.

For more information on resource and module, see [Resource declaration in Bicep](../azure-resource-manager/bicep/resource-declaration.md).

```
//Create a workspace
resource exampleWorkspace 'Microsoft.HealthcareApis/workspaces@2021-06-01-preview' = {
  name: workspaceName
  location: resourceGroup().location
}
```

To use or reference an existing workspace without creating one, use the keyword *existing*. Specify the workspace resource name, and the existing workspace instance name for the name property. Note that a different name for the existing workspace resource is used in the template, but that isn't a requirement.

```
//Use an existing workspace
resource exampleExistingWorkspace 'Microsoft.HealthcareApis/workspaces@2021-06-01-preview' existing = {
   name: workspaceName
}
```

You're now ready to deploy the workspace resource using the `az deployment group create` command. You can also deploy it along with its other resources, as described further later in this article.

## Create a FHIR service template

For the FHIR service resource, the required properties include service instance name, location, kind, and managed identity. Also, it has a dependency on the workspace resource. For the FHIR service itself, the required properties include authority and audience, which are specified in the properties element.

```
resource exampleFHIR 'Microsoft.HealthcareApis/workspaces/fhirservices@2021-11-01' = {
  name: fhirservicename
  location: resourceGroup().location
  kind: 'fhir-R4'
  identity: {
    type: 'SystemAssigned'
  }
  dependsOn: [
    exampleWorkspace  
    //exampleExistingWorkspace
  ]
  properties: {
    accessPolicies: []
    authenticationConfiguration: {
      authority: authority
      audience: audience
      smartProxyEnabled: false
    }
    }
}
```

Similarly, you can use or reference an existing FHIR service using the keyword *existing*.

```
//Use an existing FHIR service
resource exampleExistingFHIR 'Microsoft.HealthcareApis/workspaces/fhirservices@2021-11-01' existing = {
    name: fhirservicename
}
```

## Create a DICOM service template

For the DICOM service resource, the required properties include service instance name and location, and the dependency on the workspace resource type.  

```
//Create DICOM service
resource exampleDICOM 'Microsoft.HealthcareApis/workspaces/dicomservices@2021-11-01' = {
  name: dicomservicename
  location: resourceGroup().location
  dependsOn: [
    exampleWorkspace
  ]
  properties: {}
}
```

Similarly, you can use or reference an existing DICOM service using the keyword *existing*.

```
//Use an existing DICOM service
 resource exampleExistingDICOM 'Microsoft.HealthcareApis/workspaces/dicomservices@2021-11-01' existing = {
   name: dicomservicename
}
```

## Create a MedTech service template

For the MedTech service resource, the required properties include the MedTech service name, location, managed identity, and the dependency on the workspace. For the MedTech service itself, required properties include Azure Event Hubs namespace, Event Hubs, Event Hubs consumer group, and the device mapping. As an example, the heart rate device mapping is used in the template.

```
//Create IoT connector
resource exampleIoT 'Microsoft.HealthcareApis/workspaces/iotconnectors@2021-11-01' = {
  name: iotconnectorname
  location: resourceGroup().location
  identity: {
    type: 'SystemAssigned'
  }
  dependsOn: [
    exampleWorkspace
    //exampleExistingWorkspace
  ]
  properties: {
    ingestionEndpointConfiguration: {
      eventHubName: 'eventhubnamexxx'
      consumerGroup: 'eventhubconsumergroupxxx'
      fullyQualifiedEventHubNamespace: 'eventhubnamespacexxx.servicebus.windows.net'
            }
    deviceMapping: {
    content: {
    templateType: 'CollectionContent'
        template: [
                    {
                      templateType: 'JsonPathContent'
                      template: {
                              typeName: 'heartrate'
                              typeMatchExpression: '$..[?(@heartrate)]'
                              deviceIdExpression: '$.deviceid'
                              timestampExpression: '$.measurementdatetime'
                              values: [
                                {
                                      required: 'true'
                                      valueExpression: '$.heartrate'
                                      valueName: 'Heart rate'
                                      }
                                      ]
                                }
                    }
                  ]
            }
          }
      }
    }
```

Similarly, you can use, or reference an existing MedTech service using the keyword *existing*.

```
//Use an existing IoT 
resource exampleExistingIoT 'Microsoft.HealthcareApis/workspaces/iotconnectors/fhirdestinations@2021-11-01' existing = {
    name: iotconnectorname
}
```

The MedTech service requires a child resource, destination, and it currently supports the FHIR service destination only. For the MedTech service destination resource, the required properties include a name, location, and the dependency on the MedTech service. For the FHIR service destination, required properties include the resolution type, which it takes a value of *Create* or *Lookup*, the FHIR service resource ID, and a FHIR resource type. As an example, the heart rate mapping for the FHIR Observation resource is used in the template.

```
//Create IoT destination
resource exampleIoTDestination 'Microsoft.HealthcareApis/workspaces/iotconnectors/fhirdestinations@2021-11-01'  = {
  name:   iotdestinationname
  location: resourceGroup().location
  dependsOn: [
    exampleIoT
    //exampleExistingIoT
  ]
  properties: {
    resourceIdentityResolutionType: 'Create'
    fhirServiceResourceId: exampleFHIR.id //exampleExistingFHIR.id
    fhirMapping: {
                content: {
                    templateType: 'CollectionFhirTemplate'
                    template: [
                        {
                            templateType: 'CodeValueFhir'
                            template: {
                                codes: [
                                    {
                                        code: '8867-4'
                                        system: 'http://loinc.org'
                                        display: 'Heart rate'
                                    }
                                ]
                                periodInterval: 60
                                typeName: 'heartrate'
                                value: {
                                    defaultPeriod: 5000
                                    unit: 'count/min'
                                    valueName: 'hr'
                                    valueType: 'SampledData'
                                }
                            }
                        }
                    ]
                }
            }
        }
}
```

## Deploy Azure Health Data Services

You can use the `az deployment group create` command to deploy individual Bicep template or combined templates, similar to the way you deploy Azure resources with JSON templates. Specify the resource group name, and include the parameters in the command line. With the "--parameters" option, specify the parameter and value pair as "parameter = value", and separate the parameter and value pairs by a space if more than one parameter is defined.

For the Azure subscription and tenant, you can specify the values, or use CLI commands to obtain them from the current sign-in session.

```
deploymentname=xxx
resourcegroupname=rg-$deploymentname
location=centralus
workspacename=ws$deploymentname
fhirname=fhir$deploymentname
dicomname=dicom$deploymentname
medtechname=medtech$deploymentname
bicepfilename=ahds.bicep
subscriptionid=$(az account show --query id --output tsv)
tenantid=$(az account show --subscription $subscriptionid --query tenantId --output tsv)

az group create --name $resourcegroupname --location $location
az deployment group create --resource-group $resourcegroupname --template-file $bicepfilename --parameters workspaceName=$workspacename fhirName=$fhirname dicomName=$dicomname medtechName=$medtechname tenantId=$tenantid location=$location
```

Note that the child resource name such as the FHIR service includes the parent resource name, and the "dependsOn" property is required. However, when the child resource is created within the parent resource, its name doesn't need to include the parent resource name, and the "dependsOn" property isn't required. For more info on nested resources, see [Set name and type for child resources in Bicep](../azure-resource-manager/bicep/child-resource-name-type.md).

## Debugging Bicep templates

You can debug Bicep templates in Visual Studio Code, or in other environments and troubleshoot issues based on the response. Also, you can review the activity log for a specific resource in the resource group while debugging.

In addition, you can use the **output** value for debugging or as part of the deployment response. For example, you can define two output values to display the values of authority and audience for the FHIR service in the response. For more information, see [Outputs in Bicep](../azure-resource-manager/bicep/outputs.md).

```
output stringOutput1 string = authority
output stringOutput2 string = audience
```

## Next steps

In this article, you learned how to create Azure Health Data Services, including workspaces, FHIR services, DICOM services, and MedTech services using Bicep. You also learned how to create and debug Bicep templates. For more information about Azure Health Data Services, see 

>[!div class="nextstepaction"]
>[What is Azure Health Data Services](healthcare-apis-overview.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
