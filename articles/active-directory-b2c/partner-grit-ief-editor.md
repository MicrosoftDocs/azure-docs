---
title: Tutorial: Edit identity experience framework XML with Grit Visual Identity Experience Framework (IEF) Editor
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with the Grit Visual Identity Experience Framework (IEF) Editor
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 9/28/2022
ms.author: gasinh
ms.reviewer: kengaderdus
ms.subservice: B2C 
---


# Tutorial: Edit Identity Experience Framework XML with Grit Visual Identity Experience Framework Editor

In this tutorial, you'll learn how to integrate Azure Active Directory B2C (Azure AD B2C) authentication with [Grit Software Systems Visual Identity Experience Framework (IEF) Editor](https://www.gritiam.com/iefeditor), a tool that saves time during authentication deployment. It supports multiple languages without the need to write code. It also has a no code debugger for user journeys.

Use the Visual IEF Editor to:

- Create Azure AD B2C IEF XML, HTML/CSS/JS, and .NET API to deploy Azure AD B2C.
- Load your Azure AD B2C IEF XML.
- Visualize and modify your current code, check it in, and run it through a continuous integration/continuous delivery (CI/CD) pipeline.

## Sample code development workflow

The following illustration shows a sample code-development workflow from XML files to production.

![Screenshot shows the sample code-development workflow.](./media/partner-grit-ief-editor/sample-code-development-workflow.png)

>[!TIP]
>Visual IEF Editor is free and works only with Google Chrome browser.

## Prerequisites

To get started with the IEF Editor, ensure the following prerequisites are met:

- Go to [IEF Editor](https://app.archbee.com/doc/uwPRnuvZNjyEaJ8odNOEC/WmcXf6fTZjAHpx7-rAlac) and review:
  - Prerequisites for browser and Starter Pack
  - Summary for the IEF Editor objective
  - Walk-through link and instructions
- An Azure AD subscription. If you don't have one, you can get an [Azure free account](https://azure.microsoft.com/free/).
- An Azure AD B2C tenant linked to the Azure subscription. Learn more at [Tutorial: Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md).

## Scenario descriptions

The following sections illustrate two Visual IEF Editor scenarios for *Contoso* and *Fabrikam*.

### Case 1 - Contoso: IEF logic, make changes, and enable features

The *Contoso* enterprise uses Azure AD B2C, and has an extensive IEF deployment. Current challenges for *Contoso* are:

- Teaching IEF logic to new-hire developers.
- Making changes to IEF.
- Enabling features such as, fraud protection, identity protection, and biometrics.

When IEF files are loaded into Visual IEF Editor, a list of user journeys appears with a flow chart for each journey. User journey elements contain useful data and functionality. Search eases the process of tracing through IEF logic, and enabling needed features. Modified files are:

- Downloaded to a local machine
- Uploaded to GitHub
- Run through CI/CD
- Deployed to a lower environment for testing

### Case 2 - Fabrikam: Fast implementation

*Fabrikam* is a large enterprise, which has decided to use Azure AD B2C. Their goals are:

- Implement Azure AD B2C quickly
- Discover functionalities without learning IEF

>[!NOTE]
>This scenario is in private preview. For access, or questions, go to [Grit IAM Solutions](https://www.gritiam.com/). Scroll down and select **CONTACT**.

Fabrikam has a set of pre-built templates with intuitive charts that show user flows. You can use Visual IEF Editor to modify templates and then deploy them into a lower environment, or upload them to GitHub for CI/CD.

After the IEF is modified, you can download, and upload the files to Azure AD B2C to see them in action.

## Next steps

- [Tutorial: Create user flows and custom policies in Azure Active Directory B2C](custom-policy-get-started.md?tabs=applications)

- [IEF Editor](https://app.archbee.com/doc/uwPRnuvZNjyEaJ8odNOEC/WmcXf6fTZjAHpx7-rAlac) documentation

- [Grit IAM B2B2C](partner-grit-iam.md)
