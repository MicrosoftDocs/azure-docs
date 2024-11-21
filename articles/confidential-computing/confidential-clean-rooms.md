---
title: Perform Secure Multiparty Data Collaboration on Azure
description: Learn how Azure Confidential Clean Room enables multiparty collaborations while preventing outside access to the data.
author: mathapli
ms.service: azure
ms.subservice: confidential-computing
ms.topic: conceptual
ms.date: 10/28/2024
ms.author: mathapli
---

# Azure Confidential Clean Room

Azure Confidential Clean Room offers a sandboxed environment called a *clean room* that helps organizations overcome the challenges of using privacy-sensitive data for data analytics, AI model development, and inferencing. Built on top of [confidential containers in Azure Container Instances](../confidential-computing/confidential-containers.md), Azure Confidential Clean Room secures the data and the model from exfiltration outside the clean room's boundary. The service is currently in preview.

Organizations can collaborate and analyze sensitive data in the clean room without violating compliance standards or risking data breaches. Azure Confidential Clean Room uses advanced privacy-enhancing technologies like secure governance and audit, trusted execution environment (TEE), verifiable trust, differential privacy, and controlled access.

The following diagram shows how organizations collaborate by using Azure Confidential Clean Room.

:::image type="content" source="./media/confidential-clean-rooms/accr-illustration.png" alt-text="Diagram that shows the steps of clean room creation and collaboration.":::

## Who should use Azure Confidential Clean Room?

Azure Confidential Clean Room could be a great choice for you if you have these scenarios:

- **Data analytics and inferencing**: Organizations that want to build insights on second-party data while ensuring data privacy can use Azure Confidential Clean Room. Azure Confidential Clean Room is useful when data providers are concerned about data exfiltration. It helps ensure that data is used only for agreed purposes, and it safeguards against unauthorized access or egress (because it's a sandboxed environment).

- **Independent software vendor (ISV) data privacy**: ISVs that provide secure multiparty data collaboration services can use Azure Confidential Clean Room as an extensible platform. The service enables ISVs to add enforceable tamperproof contracts with governance and audit capabilities. It uses [confidential containers in Azure Container Instances](../confidential-computing/confidential-containers.md) underneath to ensure that data is encrypted during processing, which helps keep customer data secure.

- **Machine learning (ML) fine tuning**: Azure Confidential Clean Room provides a solution to organizations that require data from various sources to train or fine-tune ML models but face data-sharing regulations. It allows any party to audit and confirm that data is being used only for the agreed purpose, such as ML modeling.

- **ML inferencing**: Organizations can use Azure Confidential Clean Room in ML inferencing to enable collaborative data analysis without compromising privacy or data ownership. Azure Confidential Clean Room provides an environment where multiple parties can combine sensitive data and apply ML models for inferencing while keeping raw data inaccessible to others.

### Industries that can successfully use Azure Confidential Clean Room

- **Healthcare**: In the healthcare industry, Azure Confidential Clean Room enables secure collaboration on sensitive patient data. For example, healthcare providers can use clean rooms to train and fine-tune AI/ML models for predictive diagnostics, personalized medicine, and clinical decision support. By using confidential computing, healthcare organizations can help protect patient privacy while collaborating with other institutions to improve healthcare outcomes.

  Healthcare providers can also use Azure Confidential Clean Room for ML inferencing. Partner hospitals can use the power of these models for early detection.

- **Advertising**: In the advertising industry, Azure Confidential Clean Room facilitates secure data sharing between advertisers and publishers. Azure Confidential Clean Room enables targeted advertising and measurement of campaign effectiveness without exposing sensitive user data.

- **Banking, financial services, and insurance (BFSI)**: The BFSI sector can use Azure Confidential Clean Room to collaborate on financial data while ensuring compliance with regulatory requirements. Financial institutions can perform joint data analysis and develop risk models, fraud detection models, and lending scenarios without exposing sensitive customer information.

- **Retail**: In the retail industry, Azure Confidential Clean Room enables secure collaboration on customer data to enhance personalized marketing and inventory management. Retailers can use clean rooms to analyze customer behavior and preferences to create personalized marketing campaigns without compromising data privacy.

## Benefits

:::image type="content" source="./media/confidential-clean-rooms/accr-benefits.png" alt-text="Diagram of Azure Confidential Clean Room benefits, showing Zero Trust, no data duplication, containerized workloads, and managed governance.":::

Azure Confidential Clean Room helps ensure that sensitive data remains protected throughout the collaboration process. Here are some key benefits of using the service:

- **Secure collaboration and governance**: Azure Confidential Clean Room enables collaborators to create tamperproof contracts. Azure Confidential Clean Room also enforces all the constraints that are part of a contract. Governance ensures validity of constraints before allowing data to be released into clean rooms, and it drives transparency among collaborators by generating tamperproof audit trails. Azure Confidential Clean Room uses the open-source [Confidential Consortium Framework](https://microsoft.github.io/CCF/main/overview/what_is_ccf.html) to enable these capabilities.

- **Compliance**: Confidential computing can address some of the regulatory and privacy concerns by providing a secure environment for data collaboration. This capability is beneficial for industries such as financial services, healthcare, and telecom, which deal with highly sensitive data and personal data.

- **Enhanced data security**: Azure Confidential Clean Room uses confidential computing to provide a hardware-based TEE. This environment is sandboxed and allows only authorized workloads to run. It prevents unauthorized access to data or code during processing, to help ensure that sensitive information remains secure.

- **Zero Trust**: Verifiable trust at each step, with the help of cryptographic remote attestation, forms the cornerstone of Azure Confidential Clean Room.

- **Cost-effectiveness**: By providing a secure and compliant environment for data collaboration, Azure Confidential Clean Room reduces the need for costly and complex data protection measures. It's a cost-effective solution for organizations that want to use sensitive data for analysis and insights.

## Joining the preview

Azure Confidential Clean Room is currently in preview. If you're interested in joining the preview, fill in and submit [this form](https://aka.ms/ACCR-Preview-Onboarding). After we review your form, we'll contact you with detailed steps for joining.

For questions about joining, reach out to the [Azure Confidential Clean Room management team](mailto:CleanRoomPMTeam@microsoft.com).

## Important references

- [Samples repository for getting started with clean rooms](https://github.com/Azure-Samples/azure-cleanroom-samples)
- [Repository for confidential clean-room sidecars](https://github.com/Azure/azure-cleanroom/)

## Frequently asked questions

- Question: Where are the sidecar container images of Clean Room published?

  Answer: The sidecar container images are published at `mcr.microsoft.com/cleanroom`.

- Question: Can more than two organizations participate in a collaboration?
  
  Answer: Yes, more than two organizations can become part of a collaboration. Multiple data providers can share data in a clean room.

If you have more questions about Azure Confidential Clean Room, reach out to the [support team](mailto:accrsupport@microsoft.com).

## Related content

- [Tutorial: Prepare a deployment for a confidential container on Azure Container Instances](/azure/container-instances/container-instances-tutorial-deploy-confidential-containers-cce-arm)
- [Overview of Microsoft Azure Attestation](/azure/attestation/overview)
