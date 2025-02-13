---
title: Migrate identity and access management of AWS Lambda to Azure Functions
description: Identity and access management specification for migrating AWS Lambda to Azure Functions.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025  
ms.topic: conceptual
---

# Migrate identity and access management of AWS Lambda to Azure Functions

| :::image type="icon" source="../../migration/images/goal.svg"::: The authentication and authorization requirements implemented on your existing AWS Lambda service are equivently implemented on Azure Functions. You maintain your workload's identity security posture along with existing identity auditing requirements. Your Azure Functions implementation provides continunity for end-user access, human and automation control plane access, and workload identities for service and code dependencies. |
|--| 

## Scope

` **Author note**: Capture the specfic scope for the Azure offering. For example, if this article covers multi-tenancy or bring-your-own compute host, mention the broader scope. If the article doesn't apply to specific scope that's part of Azure offering, note that scope as not covered.  Expect this section to be boilerplate for all design areas. `

This article guides you in your pre-migration assessment of your existing AWS Lambda implementation, to prepare you for replatforming to Azure Functions.

These aspects are covered in this article:

- End state of Azure Functions hosted in Flex Consumption plan, Premium plan, Dedicated plan, or Consumption plan.

These aspects are not covered in this article:

- Migration to a container hosting solution, such as through Container Apps.
- Hosting AWS Lambda containers in Azure.

## Discovery

` **Author note**: Use this section to help the reader understand the context of their workload. During the discovery phase, they will be able to justify why it's important to carry these over to Azure. Keep in mind that the answers will vary based on the reader's business needs and won't be covered in this article. `

Understand the existing authentication and authorization approaches used by your AWS Lambda service:

` **Author note**: Enumerate all of the surface area where identity on the source service exists. These areas are where the customer needs to document current state and learn about the analogs in Azure. Consider the following: `

` - End-user authn & authz `
` - Automation authn & authz, such as deployment pipelines, interaction with service endpoints or control plane operations `
` - Routine, ad-hoc, and emergency operations access to either service endpoints or control plane operations `
` - Identities used by the Azure service directly for operational dependencies `
` - Identities used by the code running on the service for functional dependencies `

Your Azure Functions implementation will need to address all of these identity and access management surfaces. Without a complete list of requirements for these existing identities, you risk breaking end-user, workload stakeholder, or automation access. Or worse, failure to completely migrate could enable access that shouldn't be enabled.

Your workload might also have access auditing requirements that must be reimplemented in this replatforming to Azure Functions.

&#9997; Document your existing authentication, authorization, and auditing requirements through these various discovery activities.

### Assess the business requirements

- What are service and cloud-managed identities in the existing workload?
- Does the source system use security group based identities or individual identities?
- How are identities evaluated in control plane and data plane interactions?
- What are the set of permissions assigned to each identity?
- What dependencies (if any) of this workload will remain on AWS? How must identity from Azure work for those resource owner services?

### Key technical factors

` **Author note**: Enumerate the typical and prominent features of Lambda identity, covering both end user access (data plane), operations (control plane), and workload identity. Try to achieve a one-to-one mapping of IAM implementation. Make a note of gaps. `

This table lists the common features of Lambda, their governance implementation on AWS, and the recommended equivalent in Azure. 

| Feature   | AWS implementation | Azure implementation | Migration strategy |
|-----------|--------------|----------------------|--------------------|
| Feature 1 | Description  | Description          | Built-in/custom    |
| Feature 2 | Description  | Description          | Built-in/custom    |
| ...       | ...          | ...                  | ...                |

&#9997; Use the preceding table as a foundation to gather the technical details of the current AWS deployment. Expand on this list by identifying specific elements from your implementation.

### How to collect information 

Here are some approaches on taking inventory of an existing identity and access management implementations on AWS.

#### Source resources

Familiarize yourself with the Lambda implementation by using these resources:

` **Author note**: List the sources that will help the reader fill out the preceding table. Collect these sources form an AWS SME. Here are some typical examples. `
` - Your existing infrastructure as code artifacts `
` - Your automation `
` - Your workload's security documentation `

- Resource 1
- Resource 2

#### Tools and processes

` **Author note**: Collect these sources form an AWS SME. `
` - Provide instructions (or link to instructions) on how to enumerate control plane IAM configuration. `
` - Provide instructions (or link to instructions) on how to evaluate hosted code for AuthN/AuthZ controls. `
` - Provide instructions on audit reporting for typical AWS Lambda interactions are handled to have customer explore deployment. `

- Tool 1
- Tool 2
- Process 1
- Process 2

### Expected role assignments

` **Author note**: Talk about some of the control plane role assignments automation and stakeholders are going to likely need as part of this migration. Also list some of the roles that the service's managed identity will likely need to interface with common dependencies. `

### Deviations

` **Author note**: Analyze the technical map and summarize the features that require decision making. `

Deviations reflect gaps when one-to-one mapping isn't feasible. You'll need to make decisions for, prioritizing minimal deviation to business requirements. Consider the potential benefits and drawbacks of each mitigation.

Here's the summarized view of the gaps identified in the technical map. 

| Feature   | Deviation | Impact | Mitigation |
|-----------|-----------|--------|------------|
| Feature 1 |Description| Impact to business requirements | How could the customer address this during migration|
| Feature n |Description| Impact to business requirements | How could the customer address this during migration|

&#9997; Use this list as a starting point and build on it by identifying specifics from your implementation. Clearly outline how to address any deviations as part of the migration process.

### Challenges

When planning a migration to Azure, expect challenges in understanding Azure expectations and how they align with the business requirements already achieved in the existing AWS solution running in production. This list presents some of those challenges. 

` **Author note**: Have a discussion with the SME on challenges faced in their customers' migrations in this area. Provide at least two points. `

- Potential Issue 1 - Description and mitigation.
- Potential Issue 2 - Description and mitigation.

## Azure resources

- Boilerplate: Link to essential built-in policies.
- Boilerplate: Link to essential documentation.

## Post-migration considerations

After you've migrated your Lambda to Azure Functions with a level of satisfaction that doesn't regress in existing governance controls, we recommend you explore additional identity and access management features on Azure with Microsoft Entra ID. This can help you in future requirements or help close gaps in areas where your workload is not currently meeting existing requirements.

- Item 1
- Item 2
- Item 3

&#9997; Create a list of optimization opportunities. Utilize the [Well-Architected Framework for Azure Functions](/azure/well-architected/service-guides/azure-functions) to evaluate the settings that can help you achieve a higher level of excellence.

## Next step

> [!div class="nextstepaction"]
> [Address $TOPIC in your AWS Lambda migration](./governance.md)
