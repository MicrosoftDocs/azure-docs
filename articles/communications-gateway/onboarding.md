---
title: Onboarding to Microsoft Teams Phone with Azure Communications Gateway
description: Understand the Azure Communications Gateway Basic Integration Included Benefit for onboarding to Operator Connect and your other options for onboarding
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual 
ms.date: 01/18/2023
ms.custom: template-concept 
---

# Onboarding to Microsoft Teams with Azure Communications Gateway

To launch Operator Connect and/or Teams Phone Mobile, you'll need an onboarding partner. Launching requires changes to the Operator Connect or Teams Phone Mobile environments and your onboarding partner manages the integration process and coordinates with Microsoft Teams on your behalf. They can also help you design and set up your network for success.

If you're launching Operator Connect, Azure Communications Gateway includes an off-the-shelf onboarding service called the Basic Integration Included Benefit. It's suitable for simple Operator Connect use cases.

If you're launching Teams Phone Mobile, you're not eligible for the Basic Integration Included Benefit. See [Alternatives to the Basic Integration Included Benefit](#alternatives-to-the-basic-integration-included-benefit).

## Onboarding with the Basic Integration Included Benefit for Operator Connect

The Basic Integration Included Benefit (BIIB) helps you to onboard customers to your Microsoft Teams Operator Connect offering as quickly as possible. You'll need to meet the [eligibility requirements](#eligibility-for-the-basic-integration-included-benefit).

If you're eligible, we'll assign the following people as your onboarding team.

- A remote **Project Manager** as a single point of contact. The Project Manager is responsible for communicating the schedule and keeping you up to date with your onboarding status.
- Microsoft **Delivery Consultants** and other technical personnel, led by a **Technical Delivery Manager**. These people guide and support you through the onboarding process for Microsoft Teams Operator Connect. The process includes providing and certifying the Operator Connect SBC functionality and launching your Operator Connect service in the Teams Admin Center.

### Eligibility for the Basic Integration Included Benefit

To be eligible for the BIIB, you must first deploy an Azure Communications Gateway resource. In addition:

- You must be launching Microsoft Teams Operator Connect for fixed-line calls (not Teams Phone Mobile).
- Your network must be capable of meeting the [reliability requirements for Azure Communications Gateway](reliability-communications-gateway.md).
- You must not have more than two Azure service regions (the regions containing the voice and API infrastructure for traffic).
- You must not require any interworking options that aren't listed in the [interoperability description](interoperability.md).
- You must not require any API customization as part of the API Bridge feature (if you choose to deploy the API Bridge).

If you don't meet these requirements, see [Alternatives to the Basic Integration Included Benefit](#alternatives-to-the-basic-integration-included-benefit).

If we (Microsoft) determine at our sole discretion that your integration needs are unusually complex, we might:

- Decline to provide the BIIB.
- Stop providing the BIIB, even if we've already started providing it.

This limitation applies even if you're otherwise eligible.

We might also stop providing the BIIB if you don't meet [your obligations with the Basic Integration Included Benefit](#your-obligations-with-the-basic-integration-included-benefit), including making timely responses to questions and fulfilling dependencies.

### Phases of the Basic Integration Included Benefit

When you've deployed your Azure Communications Gateway resource, your onboarding team will help you to ensure that Azure Communications Gateway and your network are properly configured for Operator Connect. Your onboarding team will then help you through the Operator Connect onboarding process, so that your service is launched in the Teams Admin Center.

The BIIB has three phases. During these phases, you'll be responsible for some steps. See [Your obligations with the Basic Integration Included Benefit](#your-obligations-with-the-basic-integration-included-benefit).

#### Phase 1: gathering information

We'll share the Teams Operator Connect specification documents (for example, for network connectivity) if you don't already have access to them. We'll also provide an Operator Connect onboarding form and a proposed test plan. When you've given us the information listed in the onboarding form, your onboarding team will work with you to create a project timeline describing your path to launching in the Teams Admin Center.

#### Phase 2: preparing Azure Communications Gateway and your networks

We'll use the information you provided with the onboarding form to set up Azure Communications Gateway. We'll also provide guidance on preparing your own environment for Azure Communications Gateway.

#### Phase 3: preparing for live traffic

Your onboarding team will work through the steps described in [Prepare for live traffic with Azure Communications Gateway](prepare-for-live-traffic.md) with you. As part of these steps, we'll:

 - Work through the test plan we agreed, with your help.
 - Provide training on the Azure Communications Gateway resource for you and your support staff.
 - Help you to prepare for launch.

### Your obligations with the Basic Integration Included Benefit

You're responsible for:

- Arranging Microsoft Azure Peering Service (MAPS) connectivity. If you haven't finished rolling out MAPS yet, you must have started the roll-out and have a known delivery date.
- Signing the Operator Connect agreement.
- Providing someone as a single point-of-contact to assist us in collecting information and coordinating your resources. This person must have the authority to review and approve deliverables, and otherwise ensure that these responsibilities are carried out.
- Completing the onboarding form after we've supplied it.
- Providing test numbers and working with your onboarding team to run the test plan, including testing from your network to find call flow integration issues.
- Providing timely responses to questions, issues and dependencies to ensure the project finishes on time.
- Configuring your Operator Connect and Azure environments as described in [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md), [Deploy Azure Communications Gateway](deploy.md) and [Prepare for live traffic with Azure Communications Gateway](prepare-for-live-traffic.md).
- Ensuring that your network is compliant with the Microsoft Teams _Network Connectivity Specification_ and _Operational Excellence Specification_, and any other specifications provided by Microsoft Teams.
- Ensuring that your network engineers watch the training that your onboarding team provides.

## Alternatives to the Basic Integration Included Benefit

If you're not eligible for the Basic Integration Included Benefit (because you're deploying Teams Phone Mobile or you don't meet the [eligibility requirements](#eligibility-for-the-basic-integration-included-benefit)), you must arrange onboarding separately. You can:

- Contact your Microsoft sales representative to arrange onboarding through Microsoft.
- Find your own onboarding partner.

## Next steps

- [Review the reliability requirements for Azure Communications Gateway](reliability-communications-gateway.md).
- [Review the interoperability function of Azure Communications Gateway](interoperability.md).
- [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md).
