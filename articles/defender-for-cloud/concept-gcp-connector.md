---
title: Defender for Cloud's GCP connector
description: Learn how the GCP connector works on Microsoft Defender for Cloud.

ms.topic: conceptual
ms.service: defender-for-cloud
ms.date: 06/29/2023
---

# Defender for Cloud's GCP connector

The Microsoft Defender for Cloud GCP (Google Cloud Platform) connector is a feature that allows an organization to extend its cloud security posture management to their Google Cloud environments.

The GCP connector allows organizations to use Microsoft Defender for Cloud to monitor and assess the security state of their Google Cloud resources. The connector allows organizations to use Microsoft Defender for Cloud to apply security policies and receive security recommendations for their Google Cloud resources.

The GCP connector allows for continuous monitoring of Google Cloud resources for security risks, vulnerabilities, and misconfigurations. It also provides automated remediation capabilities to address identified risks and compliance issues. Additionally, it allows organizations to use the Microsoft Defender for Cloud's integrated threat protection capabilities to protect their Google Cloud resources from threats.

## GCP authorization design

The authentication process between Microsoft Defender for Cloud and GCP is a federated authentication process.  

When you onboard to Defender for Cloud, the GCloud template is used to create the following resources as part of the authentication process: 

- Workload identity pool and providers

- Service accounts and policy bindings

The authentication process works as follows:

:::image type="content" source="media/concept-gcp-connector/authentication-process.png" alt-text="A diagram of the Defender for Cloud GCP connector authentication process." lightbox="media/concept-gcp-connector/authentication-process.png":::

(1) - Microsoft Defender for Cloud's CSPM service acquires a Microsoft Entra token. The token is signed by Microsoft Entra ID using the RS256 algorithm and is valid for 1 hour.

(2) - The Microsoft Entra token is exchanged with Google's STS token.

(3) - Google STS validates the token with the workload identity provider. The Microsoft Entra token is sent to Google's STS that validates the token with the workload identity provider. Audience validation then occurs and the token is signed. A Google STS token is then returned to Defender for Cloud's CSPM service.

(4) - Defender for Cloud's CSPM service uses the Google STS token to impersonate the service account. Defender for Cloud's CSPM receives service account credentials that are used to scan the project.

## What happens when you onboard a single project

There are four parts to the onboarding process that take place when you create the security connection between your GCP project and Microsoft Defender for Cloud.

### Organization details

In the first section, you need to add the basic properties of the connection between your GCP project and Defender for Cloud.

:::image type="content" source="media/concept-gcp-connector/single-project-details.png" alt-text="Screenshot of the organization details page of the GCP project onboarding process." lightbox="media/concept-gcp-connector/single-project-details.png":::

Here you name your connector, select a subscription and resource group, which is used to create an ARM template resource that is called security connector. The security connector represents a configuration resource that holds the projects settings.

You can also select a location and add the organization ID for your project.

### Select plans

After entering your organization's details, you'll then be able to select which plans to enable.

:::image type="content" source="media/concept-gcp-connector/select-plans-gcp-project.png" alt-text="Screenshot of the available plans you can enable for your GCP project." lightbox="media/concept-gcp-connector/select-plans-gcp-project.png":::

From here, you can decide which resources you want to protect based on the security value you want to receive.

### Configure access

Once you've selected the plans, you want to enable and the resources you want to protect you have to configure access between Defender for Cloud and your GCP project.

:::image type="content" source="media/concept-gcp-connector/configure-access-gcp-connector.png" alt-text="Screenshot of the configure access screen between Defender for Cloud and your GCP project." lightbox="media/concept-gcp-connector/configure-access-gcp-connector.png":::

In this step, you can find the GCloud script that needs to be run on the GCP project that is going to onboarded. The GCloud script is generated based on the plans you selected to onboard.

The GCloud script creates all of the required resources on your GCP environment so that Defender for Cloud can operate and provide the following security values:

- Workload identity pool
- Workload identity provider (per plan)
- Service accounts
- Project level policy bindings (service account has access only to the specific project)

### Review and generate

The final step for onboarding is to review all of your selections and to create the connector.

:::image type="content" source="media/concept-gcp-connector/review-and-generate.png" alt-text="Screenshot of the review and generate screen with all of your selections listed." lightbox="media/concept-gcp-connector/review-and-generate.png":::

## What happens when you onboard an organization

Similar to onboarding a single project, When onboarding a GCP organization, Defender for Cloud creates a security connector for each project under the organization (unless specific projects were excluded).

### Organization details

In the first section, you need to add the basic properties of the connection between your GCP organization and Defender for Cloud.

:::image type="content" source="media/concept-gcp-connector/organization-details.png" alt-text="Screenshot of the organization details page of the GCP organization onboarding process." lightbox="media/concept-gcp-connector/organization-details.png":::

Here you name your connector, select a subscription and resource group that is used to create an ARM template resource that is called security connector. The security connector represents a configuration resource that holds the projects settings.

You also select a location and add the organization ID for your project.

When you onboard an organization, you can also choose to exclude project numbers and folder IDs.

### Select plans

After entering your organization's details, you'll then be able to select which plans to enable.

:::image type="content" source="media/concept-gcp-connector/select-plans-gcp-project.png" alt-text="Screenshot of the available plans you can enable for your GCP project." lightbox="media/concept-gcp-connector/select-plans-gcp-project.png":::

From here, you can decide which resources you want to protect based on the security value you want to receive.

### Configure access

Once you've selected the plans, you want to enable and the resources you want to protect you have to configure access between Defender for Cloud and your GCP project.

:::image type="content" source="media/concept-gcp-connector/configure-access-organization.png" alt-text="Screenshot of the configure access screen between Defender for Cloud and your GCP organization." lightbox="media/concept-gcp-connector/configure-access-organization.png":::

When you onboard an organization, there's a section that includes management project details. Similar to other GCP projects, the organization is also considered a project and is utilized by Defender for Cloud to create all of the required resources needed to connect the organization to Defender for Cloud.

In the management project details section, you have the choice of:

- Dedicating a management project for Defender for Cloud to include in the GCloud script. 
- Provide the details of an already existing project to be used as the management project with Defender for Cloud.  

You need to decide what is your best option for your organization's architecture. We recommend creating a dedicated project for Defender for Cloud. 

The GCloud script is generated based on the plans you selected to onboard. The script creates all of the required resources on your GCP environment so that Defender for Cloud can operate and provide the following security benefits:

- Workload identity pool
- Workload identity provider for each plan
- Custom role to grant Defender for Cloud access to discover and get the project under the onboarded organization
- A service account for each plan 
- A service account for the autoprovisioning service
- Organization level policy bindings for each service account
- API enablement(s) at the management project level.  

Some of the APIs aren't in direct use with the management project. Instead the APIs authenticate through this project and use one of the API(s) from another project. The API must be enabled on the management project.

### Review and generate

The final step for onboarding is to review all of your selections and to create the connector.

:::image type="content" source="media/concept-gcp-connector/review-and-generate-organization.png" alt-text="Screenshot of the review and generate screen with all of your selections listed for your organization." lightbox="media/concept-gcp-connector/review-and-generate-organization.png":::

## Next steps

[Connect your GCP projects to Microsoft Defender for Cloud](quickstart-onboard-gcp.md)
