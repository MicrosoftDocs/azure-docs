---
title: Perform Protected Multiparty Data Collaboration on Azure
description: Learn how Azure Confidential Clean Room enables multiparty collaborations while preventing outside access to the data.
author: mathapli
ms.service: azure
ms.subservice: confidential-computing
ms.topic: conceptual
ms.date: 10/28/2024
ms.author: mathapli
---

# Azure Confidential Clean Room Preview

Azure Confidential Clean Room offers a protected environment called a *clean room* that helps organizations overcome the security and privacy challenges of using sensitive data for data analytics, AI model development, and inferencing scenarios. Organizations can collaborate and analyze data in the clean room and use advanced privacy-enhancing features like protected governance and audit, verifiable trust, differential privacy, and controlled access.

Azure Confidential Clean Room is built on top of [confidential containers in Azure Container Instances](../confidential-computing/confidential-containers.md). It helps secure the data and the model from exfiltration outside the clean room's boundary.

The following diagram shows how organizations collaborate by using Azure Confidential Clean Room.

:::image type="content" source="./media/confidential-clean-rooms/azure-confidential-clean-rooms-illustration.png" alt-text="Diagram that shows the steps of clean room creation and collaboration.":::

> [!NOTE]
> Azure Confidential Clean Room is currently in limited preview. The preview is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Customers should not use the preview to process personal data or other data that's subject to legal or regulatory compliance requirements. The preview is intended for testing, evaluation, and feedback, and it shouldn't be used in production.

## Scenarios that can benefit from Azure Confidential Clean Room

Azure Confidential Clean Room could be a great choice for you if you have these scenarios:

- **Data analytics and inferencing**: Organizations that want to build insights on second-party data while helping to ensure data privacy can use Azure Confidential Clean Room. The service is useful when data providers are concerned about data exfiltration. It helps ensure that data is used only for agreed purposes. And it helps safeguard against unauthorized access or exfiltration because it's a sandboxed environment.

- **Independent software vendor (ISV) data privacy**: ISVs that provide secure multiparty data collaboration services can use Azure Confidential Clean Room as an extensible platform. The service enables ISVs to add enforceable tamper-resistant contracts with governance and audit capabilities. It uses [confidential containers in Azure Container Instances](../confidential-computing/confidential-containers.md) underneath to help ensure that data is encrypted during processing, which helps keep customer data protected.

- **Machine learning (ML) fine tuning**: Azure Confidential Clean Room provides a solution to organizations that require data from various sources to train or fine-tune ML models but face data-sharing regulations. It allows parties to audit and confirm that data is being used for the agreed purpose, such as ML modeling.

- **ML inferencing**: Organizations can use Azure Confidential Clean Room in ML inferencing to enable collaborative data analysis without compromising privacy or data ownership. Azure Confidential Clean Room provides an environment where multiple parties can combine sensitive data and apply ML models for inferencing while keeping raw data inaccessible to others.

## Industries that can benefit from Azure Confidential Clean Room

- **Healthcare**: In the healthcare industry, Azure Confidential Clean Room enables multiparty collaboration on sensitive patient data. For example, healthcare providers can use clean rooms to train and fine-tune AI/ML models for predictive diagnostics, personalized medicine, and clinical decision support. By using confidential computing, healthcare organizations can help protect patient privacy while collaborating with other institutions to improve healthcare outcomes.

  Healthcare providers can also use Azure Confidential Clean Room for ML inferencing. Partner hospitals can use the power of these models for early detection.

- **Advertising**: In the advertising industry, Azure Confidential Clean Room facilitates data sharing between advertisers and publishers. It enables targeted advertising and measurement of campaign effectiveness without exposing sensitive user data.

- **Banking, financial services, and insurance (BFSI)**: The BFSI sector can use Azure Confidential Clean Room to collaborate on financial data while complying with regulatory requirements. Financial institutions can perform joint data analysis and develop risk models, fraud detection models, and lending scenarios without exposing sensitive customer information.

- **Retail**: In the retail industry, Azure Confidential Clean Room enables collaboration on customer data to enhance personalized marketing and inventory management. Retailers can use clean rooms to analyze customer behavior and preferences to create personalized marketing campaigns while maintaining data privacy.

## Benefits

:::image type="content" source="./media/confidential-clean-rooms/azure-confidential-clean-rooms-benefits.png" alt-text="Diagram of Azure Confidential Clean Room benefits, showing verifiable trust, no data duplication, containerized workloads, and managed governance.":::

Azure Confidential Clean Room helps ensure that sensitive data remains protected throughout the collaboration process. Here are some key benefits of using the service:

- **Multiparty collaboration and governance**: Azure Confidential Clean Room enables collaborators to create tamper-resistant contracts. Governance helps ensure the validity of constraints before allowing data to be released into clean rooms, and it drives transparency among collaborators by generating protected audit trails. Azure Confidential Clean Room uses the open-source [Confidential Consortium Framework](https://microsoft.github.io/CCF/main/overview/what_is_ccf.html) to enable these capabilities.

- **Compliance**: Confidential computing can help organizations meet certain regulatory and privacy concerns by providing a more secure environment for data collaboration. This capability can be beneficial for industries such as financial services, healthcare, and telecom, which deal with sensitive and personal data.

- **Enhanced data security**: Azure Confidential Clean Room uses confidential computing to provide a sandboxed environment. This environment helps in allowing authorized workloads to run and in preventing unauthorized access to data or code during processing. It helps ensure that sensitive information remains secure.

- **Verifiable trust**: Verifiable trust at each step, with the help of cryptographic remote attestation, forms the cornerstone of Azure Confidential Clean Room.

## Joining the preview

Azure Confidential Clean Room is currently in limited preview. If you're interested in joining the preview, fill in and submit [this form](https://aka.ms/ACCR-Preview-Onboarding).

After you submit the form, we'll review your request. If we accept your request, we'll contact you with detailed steps for joining. Keep in mind that because the preview is limited, we might not be able to accept all requests.

For questions about joining, [email the Azure Confidential Clean Room management team](mailto:CleanRoomPMTeam@microsoft.com).

## Frequently asked questions

- Question: What's the location of Microsoft published sidecars?

  Answer: The Microsoft published sidecars are available at `mcr.microsoft.com/cleanroom`. The code for the sidecars is in [this repository](https://github.com/Azure/azure-cleanroom/).

- Question: Is there a sample clean-room application to try out?
  
  Answer: You can find a clean-room sample application in [this repository](https://github.com/Azure-Samples/azure-cleanroom-samples). You can try out the sample if we accept your request to join the preview.

- Question: Can more than two organizations participate in a collaboration?
  
  Answer: Yes, more than two organizations can become part of a collaboration. Azure Confidential Clean Room allows multiple data providers to share data in a clean room.

If you have more questions about Azure Confidential Clean Room, [email the support team](mailto:ACCRSupport@microsoft.com).

## Related content

- [Tutorial: Prepare a deployment for a confidential container on Azure Container Instances](/azure/container-instances/container-instances-tutorial-deploy-confidential-containers-cce-arm)
- [Overview of Microsoft Azure Attestation](/azure/attestation/overview)
