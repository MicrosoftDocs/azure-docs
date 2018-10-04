---
title: Azure Deployment Manager overview | Microsoft Docs
description: Describes how to deploy a service over many regions with Azure Deployment Manager
services: azure-resource-manager
documentationcenter: na
author: tfitzmac

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/01/2018
ms.author: tomfitz
---
# Enable safe deployment practices with Azure Deployment Manager (Public Preview)

To deploy your service across many regions and make sure it's running as expected in each region, you can use Azure Deployment Manager to coordinate a staged rollout of the service. Just as you would for any Azure deployment, you define the resources for your service in [Resource Manager templates](resource-group-authoring-templates.md). After creating the templates, you use Deployment Manager to describe the topology for your service and how it should be rolled out.

Deployment Manager is a feature of Resource Manager. It expands your capabilities during deployment. Use Deployment Manager when you have a complex service that needs to be deployed to several regions. By staging the rollout of your service, you can find potential problems before it has been deployed to all regions. If you don't need the extra precautions of a staged rollout, use the standard [deployment options](resource-group-template-deploy-portal.md) for Resource Manager. Deployment Manager seamlessly integrates with all existing third-party tools that support Resource Manager deployments, such as continuous integration and continuous delivery (CI/CD) offerings. 

Azure Deployment Manager is in public preview. To use Azure Deployment Manager, complete the [sign-up form](https://aka.ms/admsignup). Help up improve the feature by providing [feedback](https://aka.ms/admfeedback).

To use Deployment Manager, you need to create four files:

* Topology template
* Rollout template
* Parameter file for topology
* Parameter file for rollout

You deploy the topology template before deploying the rollout template.

## Supported locations

For the public preview, Deployment Manager resources are supported in Central US and East US 2. When you define resources in your topology and rollout templates, such as the service units, artifact sources, and rollouts described in this article, you must specify one of those regions for the location. However, the resources that you deploy to create your service, such as the virtual machines, storage accounts, and web apps, are supported in all of their [standard locations](https://azure.microsoft.com/global-infrastructure/services/?products=all).  

## Identity and access

With Deployment Manager, a [user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) performs the deployment actions. You create this identity before starting your deployment. It must have access to the subscription you're deploying the service to, and sufficient permission to complete the deployment. For information about the actions granted through roles, see [Built-in roles for Azure resources](../role-based-access-control/built-in-roles.md).

The identity must reside in one of the supported locations for Deployment Manager, and it must reside in the same location as the rollout.

## Topology template

The topology template describes the Azure resources that make up your service and where to deploy them. The following image shows the topology for an example service:

![Hierarchy from service topology to services to service units](./media/deployment-manager-overview/service-topology.png)

The topology template includes the following resources:

* Artifact source - where your Resource Manager templates and parameters are stored
* Service topology - points to artifact source
  * Services - specifies location and Azure subscription ID
    * Service units - specifies resource group, deployment mode, and path to template and parameter file

To understand what happens at each level, it's helpful to see which values you provide.

![Values for each level](./media/deployment-manager-overview/topology-values.png)

### Artifact source for templates

In your topology template, you create an artifact source that holds the templates and parameters files. The artifact source is a way to pull the files for deployment. You'll see another artifact source for binaries later in this article.

The following example shows the general format of the artifact source.

```json
{
	"type": "Microsoft.DeploymentManager/artifactSources",
    "name": "<artifact-source-name>",
	"location": "<artifact-source-location>",
	"apiVersion": "2018-09-01-preview",
	"properties": {
		"sourceType": "AzureStorage",
		"artifactRoot": "<root-folder-for-templates>",
		"authentication": {
			"type": "SAS",
			"properties": {
				"sasUri": "<SAS-URI-for-storage-container>"
			}
		}
	}
}
```

For more information, see [artifactSources template reference](/azure/templates/Microsoft.DeploymentManager/artifactSources).

### Service topology

The following example shows the general format of the service topology resource. You provide the resource ID of the artifact source that holds the templates and parameter files. The service topology includes all service resources. To make sure the artifact source is available, the service topology depends on it.

```json
{
    "type": "Microsoft.DeploymentManager/serviceTopologies",
	"name": "<topology-name>",
	"location": "<topology-location>",
	"apiVersion": "2018-09-01-preview",
	"properties": {
		"artifactSourceId": "<resource-ID-artifact-source>"
	},
	"dependsOn": [
		"<artifact-source>"
	],
	"resources": [
		{
			"type": "services",
		    ...
        }
    ]
}
```

For more information, see [serviceTopologies template reference](/azure/templates/Microsoft.DeploymentManager/serviceTopologies).

### Services

The following example shows the general format of the services resource. In each service, you provide the location and Azure subscription ID to use for deploying your service. To deploy to several regions, you define a service for each region. The service depends on the service topology.

```json
{
    "type": "services",
	"name": "<service-name>",
	"location": "<service-location>",
	"apiVersion": "2018-09-01-preview",
	"dependsOn": [
	    "<service-topology>"
	],
	"properties": {
		"targetSubscriptionId": "<subscription-ID>",
		"targetLocation": "<location-of-deployed-service>"
	},
	"resources": [
		{
			"type": "serviceUnits",
            ...
        }
    ]
}
```

For more information, see [services template reference](/azure/templates/Microsoft.DeploymentManager/serviceTopologies/services).

### Service Units

The following example shows the general format of the service units resource. In each service unit, you specify the resource group, the [deployment mode](deployment-modes.md) to use for deployment, and the path to the template and parameter file. If you specify a relative path for the template and parameters, the full path is constructed from the root folder in the artifacts source. You can specify an absolute path for the template and parameters, but you lose the ability to easily version your releases. The service unit depends on the service.

```json
{
	"type": "serviceUnits",
	"name": "<service-unit-name>",
	"location": "<service-unit-location>",
	"apiVersion": "2018-09-01-preview",
	"dependsOn": [
		"<service>"
	],
	"tags": {
		"serviceType": "Service West US Web App"
	},
	"properties": {
		"targetResourceGroup": "<resource-group-name>",
		"deploymentMode": "Incremental",
		"artifacts": {
			"templateArtifactSourceRelativePath": "<relative-path-to-template>",
			"parametersArtifactSourceRelativePath": "<relative-path-to-parameter-file>"
		}
	}
}
```

Each template should include the related resources that you want to deploy in one step. For example, a service unit could have a template that deploys all of the resources for your service's front end.

For more information, see [serviceUnits template reference](/azure/templates/Microsoft.DeploymentManager/serviceTopologies/services/serviceUnits).

## Rollout template

The rollout template describes the steps to take when deploying your service. You specify the service topology to use and define the order for deploying service units. It includes an artifact source for storing binaries for the deployment. In your rollout template, you define the following hierarchy:

* Artifact source
* Step
* Rollout
  * Step groups
    * Deployment operations

The following image shows the hierarchy of the rollout template:

![Hierarchy from rollout to steps](./media/deployment-manager-overview/Rollout.png)

Each rollout can have many step groups. Each step group has one deployment operation that points to a service unit in the service topology.

### Artifact source for binaries

In the rollout template, you create an artifact source for the binaries you need to deploy to the service. This artifact source is similar to the [artifact source for templates](#artifact-source-for-templates), except that it contains the scripts, web pages, compiled code, or other files needed by your service.

### Steps

You can define a step to perform either before or after your deployment operation. Currently, only the `wait` step is available. The wait step pauses the deployment before continuing. It allows you to verify that your service is running as expected before deploying the next service unit. The following example shows the general format of a wait step.

```json
{
    "apiVersion": "2018-09-01-preview",
    "type": "Microsoft.DeploymentManager/steps",
    "name": "waitStep",
	    "location": "<step-location>",
    "properties": {
        "stepType": "wait",
        "attributes": {
          "duration": "PT1M"
        }
    }
},
```

The duration property uses [ISO 8601 standard](https://en.wikipedia.org/wiki/ISO_8601#Durations). The preceding example specifies a one-minute wait.

For more information, see [steps template reference](/azure/templates/Microsoft.DeploymentManager/steps).

### Rollouts

To make sure the artifact source is available, the rollout depends on it. The rollout defines steps groups for each service unit that is deployed. You can define actions to take before or after deployment. For example, you can specify that the deployment wait after the service unit has been deployed. You can define the order of the step groups.

The identity object specifies the [user-assigned managed identity](#identity-and-access) that performs the deployment actions.

The following example shows the general format of the rollout.

```json
{
	"type": "Microsoft.DeploymentManager/rollouts",
	"name": "<rollout-name>",
	"location": "<rollout-location>",
	"apiVersion": "2018-09-01-preview",
	"Identity": {
		"type": "userAssigned",
		"identityIds": [
			"<managed-identity-ID>"
		]
	},
    "dependsOn": [
		"<artifact-source>"
    ],
	"properties": {
		"buildVersion": "1.0.0.0",
		"artifactSourceId": "<artifact-source-ID>",
		"targetServiceTopologyId": "<service-topology-ID>",
		"stepGroups": [
			{
				"name": "stepGroup1",
                "dependsOnStepGroups": ["<step-group-name>"],
				"preDeploymentSteps": ["<step-ID>"],
				"deploymentTargetId":
					"<service-unit-ID>",
				"postDeploymentSteps": ["<step-ID>"]
			},
            ...
        ]
    }
}
```

For more information, see [rollouts template reference](/azure/templates/Microsoft.DeploymentManager/rollouts).

## Parameter file

You create two parameter files. One parameter file is used when deploying the service topology, and the other is used for the rollout deployment. There are some values that you need to make sure are the same in both parameter files.  

## containerRoot variable

With versioned deployments, the path to your artifacts changes with each new version. The first time you run a deployment the path might be `https://<base-uri-blob-container>/binaries/1.0.0.0`. The second time it might be `https://<base-uri-blob-container>/binaries/1.0.0.1`. Deployment Manager simplifies getting the correct root path for the current deployment by using the `$containerRoot` variable. This value changes with each version and isn't known before deployment.

Use the `$containerRoot` variable in the parameter file for template to deploy the Azure resources. At deployment time, this variable is replaced with the actual values from the rollout. 

For example, during rollout you create an artifact source for the binary artifacts.

```json
{
	"type": "Microsoft.DeploymentManager/artifactSources",
    "name": "[variables('rolloutArtifactSource').name]",
	"location": "[parameters('azureResourceLocation')]",
	"apiVersion": "2018-09-01-preview",
	"properties": {
		"sourceType": "AzureStorage",
        "artifactRoot": "[parameters('binaryArtifactRoot')]",
	    "authentication" :
		{
			"type": "SAS",
			"properties": {
				"sasUri": "[parameters('artifactSourceSASLocation')]"
			}
		}
	}
},
```

Notice the `artifactRoot` and `sasUri` properties. The artifact root might be set to a value like `binaries/1.0.0.0`. The SAS URI is the URI to your storage container with a SAS token for access. Deployment Manager automatically constructs the value of the `$containerRoot` variable. It combines those values in the format `<container>/<artifactRoot>`.

Your template and parameter file need to know the correct path for getting the versioned binaries. For example, to deploy files for a web app, create the following parameter file with the $containerRoot variable. You must use two backslashes (`\\`) for the path because the first is an escape character.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "deployPackageUri": {
            "value": "$containerRoot\\helloWorldWebAppWUS.zip"
        }
    }
}
```

Then, use that parameter in your template:

```json
{
    "name": "MSDeploy",
    "type": "extensions",
    "location": "[parameters('location')]",
    "apiVersion": "2015-08-01",
    "dependsOn": [
        "[concat('Microsoft.Web/sites/', parameters('WebAppName'))]"
    ],
    "tags": {
        "displayName": "WebAppMSDeploy"
    },
    "properties": {
        "packageUri": "[parameters('deployPackageURI')]"
    }
}
```

You manage versioned deployments by creating new folders and passing in that root during rollout. The path flows through to the template that deploys the resources.

## Next steps

In this article, you learned about Deployment Manager. Proceed to the next article to learn how to deploy with Deployment Manager.

> [!div class="nextstepaction"]
> [Tutorial: Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md)