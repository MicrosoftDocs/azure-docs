---
title: How to initiate a cloud relocation project
description: Learn how to initiate a cloud relocation project so you can relocate workloads and applications to another region.
author: SomilGanguly
ms.author: ssumner
ms.date: 12/18/2023
ms.reviewer: ssumner
ms.topic: conceptual
ms.custom: internal
keywords: cloud adoption, cloud framework, cloud adoption framework
---
# Initiate a cloud relocation project

The Initiate phase is a single step to establish the relocation project. The guidance in the Initiate phase is more important for large relocation efforts with multiple workloads in scope. For small relocation with a single workload in scope, you can skip to [create a relocation plan](#create-a-relocation-plan). A single relocation project can include multiple source and target regions. There's no need to plan them separately. The goal of the Initiate phase is to provide stakeholders with the information they want and get the relocation the resources it needs. Here's a framework for initiating a relocation.

:::image type="content" source="./media/relocate/relocate-initiate.svg" alt-text="Diagram showing the relocation process and highlights the Initiate step in the Initiate phase. In the relocation process, there are two phases and five steps. The first phase is the Initiate phase, and it has one step called Initiate. The second phase is the Move phase, and it has four steps that you repeat for each workload. The steps are Evaluate, Select, Migrate, and Cutover." lightbox="./media/relocate/relocate-initiate.svg" border="false":::

## Identify objectives

The need to meet specific objectives drives relocation projects. You should capture these objectives so you can scope and prioritize your relocation efforts. The following table provides examples of relocation objectives.

|Objective |Motivation |Priority|
| --- | --- | --- |
|1. Comply with data-residency laws. | Meet all legal and ethical standards. | High|
|2. Improve application performance for users in a different region. | Meet revenue targets. |Medium|
|3. Add new services to internal productivity tools. | Increase employee productivity. |Low|

## Determine relocation scope

You should use the objectives to scope your relocation plan. Identify all the workloads in scope of these objectives. The workload should be the smallest unit of relocation during scoping. Anything smaller, such as environment or service, makes planning difficult to manage. In execution, you relocate workloads by migrating or redeploying workload services and components. But for planning and scoping, focus on the workload as a whole. For more information, see [What is a workload?](/azure/well-architected/what-is-well-architected-framework#workload).

## Prioritize workloads for relocation

The order you relocate workloads should reflect the priority of your objectives. Any technical dependencies, such as platforms and landing zones, should go first. Outside of technical dependencies, the order is up to you. For more information, see [Platform vs application landing zones](/azure/cloud-adoption-framework/ready/landing-zone/#platform-landing-zones-vs-application-landing-zones).

## Create a relocation plan

You should create a relocation plan that addresses service capacity and high-level project planning. At the service level, you want to verify the target region meets the capacity needs for each workload service. Once you prioritized the workloads, the rest of your relocation plan should center on the relocation project and getting stakeholder approval to proceed. Most stakeholders want to know about the schedule, team, and cost. Rather than spending time trying to estimate the schedule, resources, and cost, start the relocation process and refine the estimates as you learn more. Here are recommendations for creating a minimum viable plan to get started.

- *Build a soft schedule.* The schedule depends on the complexity of the workloads being relocated and the experience of the team involved. Instead of spending time figuring out how long it takes, start relocating the first workload. The experience allows you to better estimate a completion date, and it saves you time.

- *Use a multi-disciplinary team.* The relocation team needs technical, business, and legal/compliance expertise. The business stakeholders own the workload and should guide the technical team to meet the objectives. You need the legal or compliance teams if the workload is being relocated due to regulatory requirements.

- *Know cost factors.* Relocation has a cost. Moving data and using services isn't free. To minimize cost, you should move data once and avoid duplicating services or environments for extended periods of time. A hidden cost you might not consider comes from suppliers, partners, or third-party technical support. You might need their help to relocate a workload, and they typically charge a fee.

    The pricing for certain Azure services can differ based on the region. Therefore, it’s crucial to review the costs associated with each region before initiating a relocation project. If you’re currently utilizing Azure Reservations in your source region, consider [transferring them to your destination region](/azure/cost-management-billing/reservations/exchange-and-refund-azure-reservations). Also, don’t forget to account for the [Azure network bandwidth costs](https://azure.microsoft.com/pricing/details/bandwidth) associated with data transfers between regions during the relocation process.

## Next step

The next step is the Move phase of relocation. The Move phase has four steps: evaluate, select, migrate, and cutover. You might have one or more workloads to relocate. Regardless of number, you should work through these four steps for any workload you want to relocate.

> [!div class="nextstepaction"]
> [Evaluate](./relocate-evaluate.md)
	