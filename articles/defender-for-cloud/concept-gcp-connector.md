---
title: GCP connector 
description: Learn how 
titleSuffix: Microsoft Defender for Cloud
ms.topic: conceptual
ms.date: 01/25/2023
---

# Microsoft Defender for Cloud GCP connector

The Microsoft Defender for Cloud GCP (Google Cloud Platform) connector is a feature that allows an organizations to extend its cloud security posture management to their Google Cloud environments.

The GCP connector allows organizations to use Microsoft Defender for Cloud to monitor and assess the security state of their Google Cloud resources. The connector allows organizations to use Microsoft Defender for Cloud to apply security policies and receive security recommendations for their Google Cloud resources.

The GCP connector allows for continuous monitoring of Google Cloud resources for security risks, vulnerabilities, and misconfigurations. It also provides automated remediation capabilities to address identified risks and compliance issues. Additionally, it allows organizations to use the Microsoft Defender for Cloud's integrated threat protection capabilities to protect their Google Cloud resources from threats.

## GCP authorization design

The authentication process between Microsoft Defender for Cloud and GCP, is a federated authentication process.  

When you onboard to Defender for Cloud, the GCloud template is used to create the following resources as part of the authentication process: 

- Workload identity pool and providers

- Service accounts and policy bindings

The authentication process works as follows:

:::image type="content" source="media/concept-gcp-connector/authentication-process.png" alt-text="A diagram of the Defender for Cloud GCP cpnnector authentication process.":::

(1) - Microsoft Defender for Cloud's CSPM service acquires an AAD token. The token is signed by AAD using the RS256 algorithm and is valid for 1 hour.

(2) - The AAD token is exchanged with Google's STS token.

(3) - Google STS validates the token with the workload identity provider. The AAD token is sent to Google's STS, which validates the token with the workload identity provider. Audience validation then occurs and the token is signed. A Google STS token is then returned to Defender for Cloud's CSPM service.

(4) - Defender for Cloud's CSPM service uses the Google STS token to impersonate the service account. Defender for Cloud's CSPM receives service account credentials which will then be used to scan the project.

## What happens when you onboard a single project

There are four parts to the onboarding process that take place when you create the security connection between your GCP project and Microsoft Defender for Cloud.

### Organization details

In the first section you will need to add the basic properties of the connection between your GCP project and Defender for Cloud.

:::image type="content" source="media/concept-gcp-connector/single-project-details.png" alt-text="Screenshot of the organization details page of the GCP project onboarding process.":::

Here you will name your connector, select a subscription and resource group which will be used to create an ARM resource which is called security connector. The security connector represents a configuration resource that holds the projects settings.

You will also select a location and add the organization ID for your project.

### Select plans

After entering your organization's details you will then be able to select which plans to enable.

:::image type="content" source="media/concept-gcp-connector/select-plans-gcp-project.png" alt-text="Screenshot of teh available plans you can enable for your GCP project.":::

From here you can decide which resources you want to protect based on the security value you want to receive.

### Configure access

Once you have selected the plans you want to enable and the resources you want to protect you will then have to configure access between Defender for Cloud and your GCP project.

:::image type="content" source="media/concept-gcp-connector/configure-access-gcp-connector.png" alt-text="Screenshot of the configure access screen between Defender for Cloud and your GCP project.":::

In this step you'll find the GCLoud script that needs to be run on the GCP project that is going to onboarded. The GCloud script is generated based on the plans you selected to onboard.

The GCloud script creates all of the required resources on your GCP environment so that Defender for Cloud can operate and provide the following security values:

- Workload identity pool
- Workload identity provider (per plan)
- Service accounts
- Project level policy bindings (service account will have access only to the specific project)

### Review and generate

The final step for onboarding is to review all of your selections and to create the connector.

:::image type="content" source="media/concept-gcp-connector/review-and-generate.png" alt-text="Screenshot of the review and generate screen with all of your selections listed.":::

## What happens when you onboard an organization

Similar to onboarding a single project, When onboarding a GCP organization, Defender for Cloud creates a security connector for each project under the organization (unless specific projects were excluded).

### Organization details

In the first section you will need to add the basic properties of the connection between your GCP organization and Defender for Cloud.

:::image type="content" source="media/concept-gcp-connector/organization-details.png" alt-text="Screenshot of the organization details page of the GCP project onboarding process.":::

Here you will name your connector, select a subscription and resource group which will be used to create an ARM resource which is called security connector. The security connector represents a configuration resource that holds the projects settings.

You will also select a location and add the organization ID for your project.

### Select plans

After entering your organization's details you will then be able to select which plans to enable.

:::image type="content" source="media/concept-gcp-connector/select-plans-gcp-project.png" alt-text="Screenshot of teh available plans you can enable for your GCP project.":::

From here you can decide which resources you want to protect based on the security value you want to receive.

### Configure access

Once you have selected the plans you want to enable and the resources you want to protect you will then have to configure access between Defender for Cloud and your GCP project.

:::image type="content" source="media/concept-gcp-connector/configure-access-gcp-connector.png" alt-text="Screenshot of the configure access screen between Defender for Cloud and your GCP project.":::

In this step you'll find the GCLoud script that needs to be run on the GCP project that is going to onboarded. The GCloud script is generated based on the plans you selected to onboard.

The GCloud script creates all of the required resources on your GCP environment so that Defender for Cloud can operate and provide the following security values:

- Workload identity pool
- Workload identity provider (per plan)
- Service accounts
- Project level policy bindings (service account will have access only to the specific project)

### Review and generate

The final step for onboarding is to review all of your selections and to create the connector.

:::image type="content" source="media/concept-gcp-connector/review-and-generate.png" alt-text="Screenshot of the review and generate screen with all of your selections listed.":::
