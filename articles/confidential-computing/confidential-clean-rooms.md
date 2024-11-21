---
title: Perform secure multiparty data collaboration on Azure
description: Learn how Azure Confidential Clean Room enables multiparty collaborations while keeping your data safe from other collaborators.
author: mathapli
ms.service: azure
ms.subservice: confidential-computing
ms.topic: conceptual
ms.date: 10/28/2024
ms.author: mathapli
---

# Azure Confidential Clean Room

Azure Confidential Clean Room offers a secure and compliant environment that helps organizations overcome the challenges of using privacy-sensitive data for AI model development, inferencing, and data analytics. Built on top of [confidential containers in Azure Container Instances](../confidential-computing/confidential-containers.md), this service secures the data and the model from exfiltration outside the clean room boundary. The service is currently in preview.

Organizations can safely collaborate and analyze sensitive data, within the sandbox, without violating compliance standards or risking data breaches by using advanced privacy-enhancing technologies like secure governance & audit, secure collaboration (TEE), verifiable trust, differential privacy, and controlled access.

## Who should use Azure Confidential Clean Room?

Azure Confidential Clean Room could be a great choice for you if you have these scenarios:

- Data analytics and inferencing: Organizations looking to build insights on second-party data while ensuring data privacy can use Azure Confidential Clean Room. Azure Confidential Clean Room is useful when data providers are concerned about data exfiltration. Azure Confidential Clean Room ensures that data is only used for agreed purposes and safeguards against unauthorized access or egress (as it's a sandboxed environment).
- Data privacy ISVs: Independent Software Vendors (ISVs) who provide secure multiparty data collaboration services can use Azure Confidential Clean Room as an extensible platform. It allows them to add enforceable tamperproof contracts with governance and audit capabilities, and uses [Confidential containers or C-ACI](../confidential-computing/confidential-containers.md) underneath to ensure data is encrypted during processing so that their customers' data remains secure.
- ML fine tuning: Azure Confidential Clean Room provides a solution to organizations that require data from various sources to train or fine-tune machine learning models but face data sharing regulations. It allows any party to audit and confirm that data is being used only for the agreed purpose, such as ML modeling.
- ML inferencing: Organizations can use Azure Confidential Clean Room in machine learning (ML) inferencing to enable secure, collaborative data analysis without compromising privacy or data ownership. Azure Confidential Clean Room acts as secure environment where multiple parties can combine sensitive data and apply ML models for inferencing while keeping raw data inaccessible to others.

### Industries that can successfully utilize Azure Confidential Clean Room

- Healthcare: In the healthcare industry, Azure Confidential Clean Room enables secure collaboration on sensitive patient data. For example, healthcare providers can use clean rooms to train and fine-tune AI/ML models for predictive diagnostics, personalized medicine, and clinical decision support. By using confidential computing, healthcare organizations can protect patient privacy while collaborating with other institutions to improve healthcare outcomes.
Azure Confidential Clean Room can also be used for ML inferencing where partner hospitals can utilize power of these models for early detection.
- Advertising: In the advertising industry, Azure Confidential Clean Room facilitates secure data sharing between advertisers and publishers. Azure Confidential Clean Room enables targeted advertising and campaign effectiveness measurement without exposing sensitive user data.
- Banking, Financial Services and Insurance (BFSI): The BFSI sector can use Azure Confidential Clean Room to securely collaborate on financial data, ensuring compliance with regulatory requirements. This enables financial institutions to perform joint data analysis and develop risk models, fraud detection models, lending scenarios among others without exposing sensitive customer information.
- Retail: In the retail industry, Azure Confidential Clean Room enables secure collaboration on customer data to enhance personalized marketing and inventory management. Retailers can use clean rooms to analyze customer behavior and preferences to create personalized marketing campaigns without compromising data privacy.

## Benefits

:::image type="content" source="./media/confidential-clean-rooms/accr-benefits.png" alt-text="Diagram of Azure Confidential Clean Room benefits, showing zero trust, no data duplication of container workloads, and managed governance.":::

Azure Confidential Clean Room provides a secure and compliant environment for multi-party data collaboration. Built on [Confidential containers or C-ACI](../confidential-computing/confidential-containers.md), Azure Confidential Clean Room ensures that sensitive data remains protected throughout the collaboration process. Here are some key benefits of using Azure Confidential Clean Room:

- Secure collaboration and governance:
Azure Confidential Clean Room allows collaborators to create tamper-proof contracts. Azure Confidential Clean Room also enforces all the constraints which are part of the contract. Governance ensures validity of constraints before allowing data to be released into clean rooms and drives transparency among collaborators by generating tamper-proof audit trails. Azure Confidential Clean Room uses the open-sourced [confidential consortium framework](https://microsoft.github.io/CCF/main/overview/what_is_ccf.html) to enable these capabilities.
- Compliance:
Confidential computing can address some of the regulatory and privacy concerns by providing a secure environment for data collaboration. This capability is beneficial for industries such as financial services, healthcare, and telecom, which deal with highly sensitive data and personal data.
- Enhanced data security:
Azure Confidential Clean Room is built using confidential computing to provide a hardware-based, trusted execution environment (TEE). This environment is sandboxed and allows only authorized workloads to execute and prevents unauthorized access to data or code during processing, ensuring that sensitive information remains secure.
- Verifiable trust at each step with the help of cryptographic remote attestation forms the cornerstone of Azure Confidential Clean Room.

- Cost-effective:
By providing a secure and compliant environment for data collaboration, Azure Confidential Clean Room reduces the need for costly and complex data protection measures. This makes it a cost-effective solution for organizations looking to use sensitive data for analysis and insights.

:::image type="content" source="./media/confidential-clean-rooms/accr-illustration.png" alt-text="Diagram of Azure Confidential Clean Room benefits, showing all steps of clean room creation.":::

## Onboarding to Azure Confidential Clean Room

Azure Confidential Clean Room is currently in Gated Preview. To express your interest in joining the gated preview, follow these steps:

- Fill and submit [the form](https://aka.ms/ACCR-Preview-Onboarding).
- Once you submit, further steps will be shared with you on onboarding.
- For further questions on onboarding reach out to the [Azure Confidential Clean Room management team](mailto:CleanRoomPMTeam@microsoft.com).
- After reviewing details, we'll reach out to you with detailed steps for onboarding.

## Frequently asked questions

- Question: Where is the location Microsoft published side cars?
  
  Answer: The Microsoft published side cars are available at: mcr.microsoft.com/cleanroom. The code repository for the sidecars is present [here](https://github.com/Azure/azure-cleanroom/).

- Question: Is there a sampleclean room application to try out?
  
  Answer: You can find the clean room sample application on [GitHub](https://github.com/Azure-Samples/azure-cleanroom-samples). Please feel free to try out the sample after signing up for the Preview and receiving our response.

- Question: Can more than two collaborators participate in a collaboration?
  
  Answer: Yes, more than two collaborators can become part of collaboration. This allows multiple data providers to share data in the clean room.

If you have questions about Azure Confidential Clean Room, reach out to the [support team](mailto:accrsupport@microsoft.com).

## Related content

- [Deploy confidential container group with Azure Container Instances](/azure/container-instances/container-instances-tutorial-deploy-confidential-containers-cce-arm)
- [Microsoft Azure Attestation](/azure/attestation/overview)
