---
title: Perform secure multiparty data collaboration on Azure
description: Learn how Azure Confidential Clean Rooms enables multiparty collaborations while keeping your data safe from other collaborators.
author: mathapli
ms.service: azure
ms.subservice: confidential-computing
ms.topic: conceptual
ms.date: 10/28/2024
ms.author: mathapli
---

# Azure Confidential Clean Rooms

> [!NOTE]
> Azure Confidential Clean Rooms is currently in Gated Preview. Please fill the form at https://aka.ms/ACCRPreview and we will reach out to you with next steps.

Azure Confidential Clean Rooms, aka ACCR, offers a secure and compliant environment that helps organizations overcome the challenges of using privacy-sensitive data for AI model development. This solution ensures that the model's intellectual property remains intact while also enabling advanced data analytics.
Organizations can safely collaborate and analyze sensitive data without violating compliance standards or risking data breaches by using advanced privacy-enhancing technologies like secure governance & audit, secure collaboration (TEE), verifiable trust, differential privacy, and controlled access.

## Who should use Azure Confidential Clean Rooms?
Azure Confidential Clean Rooms could be a great choice for you if you have these scenarios: 

- Data analytics and inferencing: Organizations looking to build insights on second-party data while ensuring data privacy can leverage ACCR. ACCR is useful when data providers are concerned about data exfiltration. ACCR ensures that data is only used for agreed purposes and safeguards against unauthorized access or egress (as it is a sandboxed environment). 
- Data privacy ISVs: Independent Software Vendors (ISVs) who provide secure multiparty data collaboration services can use ACCR as an extensible platform. It allows them to add enforceable tamperproof contracts with governance and audit capabilities, and uses confidential hardware underneath to ensure data is encrypted during processing so that their customers' data remains secure.
- ML fine tuning: For organizations that require data from various sources to train or fine-tune machine learning models but face data sharing regulations, ACCR provides a solution. It allows any party to audit and confirm that data is being used only for the agreed purpose, such as ML modeling
- ML inferencing: For organizations that require data from various sources to train or fine-tune machine learning models but face data sharing regulations, ACCR provides a solution. It allows any party to audit and confirm that data is being used only for the agreed purpose, such as ML modeling

### Industries which can successfully utilize ACCR
1. Healthcare- In the healthcare industry, Azure Confidential Clean Rooms enable secure collaboration on sensitive patient data. For example, healthcare providers can use clean rooms to train and fine-tune AI/ML models for predictive diagnostics, personalized medicine, and clinical decision support. By leveraging confidential computing, healthcare organizations can protect patient privacy while collaborating with other institutions to improve healthcare outcomes.
Subsequently, ACCR can also be used for ML inferencing where partner hospitals can utilize power of these models for early detection.
2. Advertising- In the advertising industry, Azure Confidential Clean Rooms facilitates secure data sharing between advertisers and publishers. ACCR enables targeted advertising and campaign effectiveness measurement without exposing sensitive user data.
3. Banking, Financial Services and Insurance (BFSI) - The BFSI sector can use Azure Confidential Clean Rooms to securely collaborate on financial data, ensuring compliance with regulatory requirements. This enables financial institutions to perform joint data analysis and develop risk models, fraud detection models, lending scenarios among others without exposing sensitive customer information.
4. Retail- In the retail industry, Azure Confidential Clean Rooms enables secure collaboration on customer data to enhance personalized marketing and inventory management. Retailers can use clean rooms to analyze customer behavior and preferences to create personalized marketing campaigns without compromising data privacy.

## Benefits

:::image type="content" source="./media/confidential-clean-rooms/accr-benefits.png" alt-text="Graphic of Azure Confidential Clean Rooms benefits, showing zero trust, no data duplicationm container workloads, and managed governance.":::

Azure Confidential Clean Rooms (ACCR) provides a secure and compliant environment for multi-party data collaboration. Built on confidential hardware, ACCR ensures that sensitive data remains protected throughout the collaboration process. Here are some key benefits of using Azure Confidential Clean Rooms:

- Secure collaboration and governance:
ACCR allows collaborators to create tamper-proof contracts. ACCR also enforces all the constraints which are part of the contract. Governance ensures validity of constraints before allowing data to be released into clean rooms and drives transparency amongst collaborators by generating tamper-proof audit trails. ACCR uses the open-sourced [confidential consortium framework](../managed-ccf/confidential-consortium-framework-overview.md) to enable these capabilities.
- Compliance:
Confidential computing can address some of the regulatory and privacy concerns by providing a secure environment for data collaboration. This capability is beneficial for industries such as financial services, healthcare, and telecom, which deal with highly sensitive data and personally identifiable information (PII).
- Enhanced data security:
ACCR is built using confidential computing to provide a hardware-based, trusted execution environment (TEE). This environment is sandboxed and allows only authorized workloads to execute and prevents unauthorized access to data or code during processing, ensuring that sensitive information remains secure.
- Verifiable trust at each step with the help of cryptographic remote attestation forms the cornerstone of Azure Confidential Clean Rooms.

:::image type="content" source="./media/confidential-clean-rooms/accr-illustration.png" alt-text="Graphic of Azure Confidential Clean Rooms benefits, showing all steps of clean room creation.":::

- Cost-effective: 
By providing a secure and compliant environment for data collaboration, ACCR reduces the need for costly and complex data protection measures. This makes it a cost-effective solution for organizations looking to leverage sensitive data for analysis and insights


## Onboarding to Azure Confidential Clean Rooms
ACCR is currently in Gated Preview. To express your interest in joining the gated preview, please follow these steps:
- Fill and submit the form at https://aka.ms/ACCR-Preview-Onboarding
- Once you submit the form, we will review it and reach out to you with next steps. 
- Here are steps to execute some sample scenarios to deploy a clean room. Please use them for guidance.

> [!Important]
> The scenarios mentioned here are sample scenarios and have the goal to give you glimpse into how you can set up clean room for your own specific scenario. They are not exhaustive and are for reference purpose only. 

### Prereqs
#### Dev Container/GitHub Codespaces
##### Dev Container/GitHub Codespaces:
You can open [this repo](https://github.com/Azure/azure-cleanroom-private/blob/main/README.md#quickstart) in a dev container or a GitHub Codespace. These environments are pre-configured so the only other setup required is to add the CleanRoom Azure CLI extension using:
```azurecli
az extension add --source https://cleanroomazcli.blob.core.windows.net/azcli/cleanroom-0.0.6-py2.py3-none-any.whl -y --allow-preview true
```
##### Local Setup:
We recommend running the following steps in PowerShell on WSL using Ubuntu 22.04.
- Instructions for setting up WSL can be found [here](https://learn.microsoft.com/windows/wsl/install).
- To install PowerShell on WSL, follow the instructions [here](https://learn.microsoft.com/powershell/scripting/install/install-ubuntu).

To set this infrastructure up, we will need the following tools to be installed prior to running the setup scripts.
1. An Azure subscription with adequate permissions to create resources and manage permissions on these resources.
1. Azure CLI version >= 2.57. Installation instructions [here](https://learn.microsoft.com/cli/azure/install-azure-cli-linux).
1. You need Docker for Linux installed locally. Installation instructions [here](https://docs.docker.com/engine/install/#supported-platforms).
1. Confidential containers Azure CLI extension, version >= 0.3.5. You can install this extension using az extension add --name confcom -y. You can check the version of the extension using az extension show --name confcom. Learn about it [here](https://learn.microsoft.com/cli/azure/confcom).
1. azcopy versions >= 10.25.0. Installation instructions [here](https://learn.microsoft.com/azure/storage/common/storage-use-azcopy-v10).
1. openssl - Download instructions for Linux [here](https://openssl-library.org/source/).
1. jq - Download / install instructions for Linux [here](https://jqlang.github.io/jq/download/).
1. Add the CleanRoom Azure CLI extension using the command here:
   ```azurecli
   az extension add --source https://cleanroomazcli.blob.core.windows.net/azcli/cleanroom-0.0.6-py2.py3-none-any.whl -y --allow-preview true
   ```



#### [Data Analytics with DB engine- CLI example](#tab/analyticscli)
In this sample scenario, there is a data provider and data consumer. The data consumer wants to run a matching query on the data provider's data and find matches from their own data. The clean room will run inside the data consumer's tenant. 

##### Creating Identity

1. The data consumer creates an identity public and private key pair for themselves. Each collaboration memeber is identified by a public-key certificate used for client authentication and command signing.
   ```azurecli
   # Ensure you have openssl installed before running the command below.
   az cleanroom governance member keygenerator-sh | bash -s -- --name "consumer" --out ./demo-resources
   ```
   Above command shows output similar to below.
   ```azurecli
   -- Generating identity private key and certificate for participant "consumer"...
    Identity curve: secp384r1
    Identity private key generated at:   ./demo-resources/publisher_privk.pem
    Identity certificate generated at:   ./demo-resources/publisher_cert.pem (to be registered in CCF)
   ```

1. The data publisher also created identity for themselves using similar steps 
   ```azurecli
   # Ensure you have openssl installed before running the command below.
   az cleanroom governance member keygenerator-sh | bash -s -- --name "publisher" --out ./demo-resources
   ```
   Above command shows output similar to below.
   ```azurecli
   -- Generating identity private key and certificate for participant "publisher"...
    Identity curve: secp384r1
    Identity private key generated at:   ./demo-resources/publisher_privk.pem
    Identity certificate generated at:   ./demo-resources/publisher_cert.pem (to be registered in CCF)
   ```


1. The data publisher creates a collaboration called 'Analytics Collab'
   ```azurecli
   
   ```

1. 

#### [Model Inferencing- CLI example](#tab/inferencingcli)



- For further questions on onboarding reach out to  <CleanRoomPMteam@microsoft.com>.
- After reviewing details, we will reach out to you with detailed steps for onboarding.

## Frequently asked questions

- Question: Where is the location Microsoft published side cars?
  Answer: The Microsoft published side cars are available at: https://mcr.microsoft.com/cleanroom 

- Question: Can more than two collaborators participate in a collaboration?
  Answer: Yes, more than two collaborators can become part of collaboration. This allows multiple data providers to share data in the clean room.

If you have questions about Azure Confidential Clean Rooms, reach out to <accrsupport@microsoft.com>.

## Next steps

- [Deploy Confidential container group with Azure Container Instances](/azure/container-instances/container-instances-tutorial-deploy-confidential-containers-cce-arm)
- [Microsoft Azure Attestation](/azure/attestation/overview)