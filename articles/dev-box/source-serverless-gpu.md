Dev Box Serverless GPU Compute 

Overview 

Enterprises are increasingly looking for flexible, scalable, and cost-efficient solutions to run high-performance AI workloads. Traditional GPU provisioning often requires long-term commitments and significant upfront investments, making it challenging for organizations to optimize resources and control costs, especially for sporadic, high-intensity workloads. 

The Dev Box Serverless GPU Compute feature addresses this challenge by integrating Microsoft Dev Box with Azure Container Apps (ACA), enabling on-demand access to powerful GPU resources without requiring long-term provisioning. Developers can dynamically allocate GPU power within their Dev Box based on the demands of their AI tasks, such as model training, fine-tuning, and data preprocessing. 

Beyond compute flexibility, Dev Box also provides a secure development environment for AI workloads that require access to sensitive corporate data. Many enterprises need to train models on proprietary datasets that are restricted by network-layer security policies. Since Dev Box is already embedded within an organization’s secure network and governance framework, it enables AI engineers to access and process protected data while ensuring compliance with corporate security standards. 

This integration delivers a unique combination of flexibility, security, and cost optimization, ensuring that enterprises can scale GPU resources efficiently while maintaining tight control over data access and compliance. By eliminating the complexities of provisioning and securing AI development environments, Dev Box enables developers to focus on innovation rather than infrastructure management. 

Architecture 

The Dev Box Serverless GPU Compute feature leverages a tight integration with Azure Container Apps (ACA) to provide on-demand, high-performance GPU compute for AI workloads attached to the customer’s private network. This architecture is designed to be seamless for developers, enabling powerful compute resources without the need for manual setup or long-term provisioning. 

Integration with Azure Container Apps (ACA) 

At the core of the Dev Box serverless GPU compute solution is the integration with Azure Container Apps Serverless GPU. This integration ensures that developers can access GPU resources on-demand, scaling as required by their AI workloads. ACA abstracts the complexity of GPU provisioning, allowing Dev Box to handle resource allocation and usage automatically without requiring intervention from the developer. 

Seamless User Experience: With this integration, users will interact with Dev Box as usual, without needing to be aware that Azure Container Apps is behind the scenes nor creating any resources or connections themselves. GPU resources will be allocated dynamically as part of the Dev Box infrastructure, abstracting the ACA technology and setup away from the developer. 

MOBO Architecture Model: We will adopt the MOBO architecture model for ACA integration. In this model, ACA instances will be created and managed within the customer’s subscription, providing a more controlled and streamlined management experience for the customers. The dev box service can effectively and securely manage ACA session Box without introducing additional complexity. 

GPU Hardware Availability 

ACA currently supports two primary GPU options for AI workloads: 

NVIDIA T4 GPUs – Readily available with minimal quota concerns 

NVIDIA A100 GPUs – More powerful but available in limited capacity 

These GPU resources are currently available in four Azure regions: 

West US 3 

Sweden North 

Australia East 

While the initial rollout focuses on these locations, ACA’s GPU support can be expanded into additional regions based on demand. The v0 integration will only support T4 GPUs 

Consideration for vNet Injection 

We recognize that vNet injection will likely be a common customer ask. vNet injection will allow customers to integrate their network and security protocols with the serverless GPU environment. Although this capability is not a requirement for the POC, it will be prioritized for public previews and general availability (GA). We will ensure that with vNet injection, customers can leverage vNet injection for tighter control over network and security configurations. 

Enabling Serverless GPUs at the Project Level 

Serverless GPUs will be enabled per project using Dev Center Project Policies. This allows administrators to define and control which projects within an organization can access GPU resources, ensuring that GPU usage is in line with organizational requirements and budget considerations. See admin controls section for details on specific configurations.  

Access Control and Serverless GPU Granting 

Access to serverless GPU resources in Dev Box will be managed through project-level properties. When the serverless GPU feature is enabled for a project, all Dev Boxes within that project will automatically have access to GPU compute. 

This shift simplifies the access model by removing the need for custom roles or pool-based configurations. Instead, GPU access is now governed centrally through a project properties. Future iterations of project Dev Center’s project policy infrastructure. 

For more information on how admins can enable this feature, define GPU types, and set per-user limits, see the Admin Controls section. 

Developer Experience 

The goal of the Developer Experience for Dev Box Serverless GPU Compute is to make accessing GPU resources seamless and native, with no setup required from the developer. The aim is to create a new kind of shell that has built-in access to GPU compute via an ACA session. This shell will be available across platforms like Windows Terminal, Visual Studio, and VS Code in a native, in-box experience. 

Shell Extension for Windows Terminal 

Windows Terminal serves as a terminal emulator for different kinds of shells. To enable GPU access, we will introduce a new shell, tentatively called "DevBoxGPU Shell". This shell will be connected to a serverless GPU ACA session, allowing developers to run GPU-powered workloads directly from the terminal. 

When a new shell instance is launched, an ACA session will start running in the background, providing GPU access. 

The ACA instance will remain active as long as the shell is open, and resource usage will be billed accordingly. 

Once the shell is closed, the ACA instance will automatically shut down, stopping any further resource usage and billing. 

This ensures that developers have access to GPU resources with zero manual configuration, providing a clean and efficient workflow. 

A screenshot of a computer program

AI-generated content may be incorrect., Picture 

Visual Studio  

Since Visual Studio hosts Windows Terminal natively and can expose various shells, it allows us to extend this seamless GPU access directly within the IDE. By creating GPU-powered shells within Visual Studio, developers will be able to launch GPU-intensive tasks directly from their development environment, further streamlining their workflow: 

A screen shot of a computer

AI-generated content may be incorrect., Picture 

AI Toolkit for VS Code 

The AI Toolkit for VS Code provides a rich ecosystem for AI development as a VS Code extension, including fine-tuning, inference, and an integrated model marketplace. Dev Box Serverless GPU Compute will seamlessly integrate with the AI Toolkit’s ACA-based backend, enabling developers to: 

Instantly access serverless GPUs for AI workloads without additional setup. 

Utilize the AI Toolkit’s model marketplace to select and deploy AI models efficiently. 

Leverage built-in fine-tuning and inference capabilities powered by ACA. 

Use an integrated playground to test and iterate on AI models in real-time. 

This integration ensures that developers can take advantage of serverless GPU compute provided via Dev Box directly within VS Code, making AI development more accessible and frictionless. 

Multiple Shell Instances 

From an architectural standpoint, there are several options regarding how new instances of the DevBoxGPU Shell can interact with ACA sessions. Below are the key options we are considering: 

Option 1: Multiple instances of the DevBoxGPU Shell share a single ACA session. In this setup, the same GPU is allocated across multiple shell instances, allowing them to share GPU compute resources. 

Option 2: Each new instance of the DevBoxGPU Shell is assigned to a separate ACA session, with each instance having its own dedicated GPU. This means that a user can access multiple GPUs simultaneously by running separate instances of the shell. For POC purposes, we will pursue this option. 

Option 3: The system allocates dedicated GPUs to each instance of the DevBoxGPU Shell until the user’s maximum GPU allocation is reached. After this limit is hit, additional shell instances will begin sharing GPU compute across sessions. 

For the POC, we will pursue Option 2, where each shell instance gets its own dedicated ACA session and GPU, ensuring clear isolation of resources. 

 

Admin controls 

Project Policies 

Serverless GPU access is controlled through project properties. Admins will be able to manage serverless GPU settings via API or a forthcoming Project Configuration blade in the portal. 

Key capabilities include: 

Enable/Disable GPU Access: Serverless GPU compute can be toggled at the project level through a dedicated property. 

Set Max Concurrent GPU Count: Each project can specify the maximum number of GPUs that can be used concurrently across all Dev Boxes in that project. This acts as a soft cap for total GPU usage, helping control overall consumption. 

Because only T4 will be available for v0 

Note: While project policies (as known today) do not directly govern GPU access, future enhancements will integrate project policies more tightly with these GPU properties, enabling better governance and centralized enforcement. 

 

Additional Cost Controls 

For Proof of Concept (POC) purposes, subscription quota will be utilized for cost management. This means the overall GPU usage across projects will be managed within a user’s subscription limits. However, as the feature evolves, we may need to consider per-project GPU quotas at the project policy level to provide further granularity and control over costs.  

Image Management 

Each ACA instance will be tied to a Linux image. While ACA provides a broad set of pre-configured images, we anticipate that Dev Box customers may prefer to use their own custom images to better meet their specific requirements. To support this, we are evaluating options for custom image management. 

One current option is to bring your own image by providing an Azure Container Registry (ACR) that contains the desired image. This would allow admins to upload and manage custom images for use within ACA. 

For the POC purposes, we will utilize ACA’s pre-canned images (https://learn.microsoft.com/en-us/azure/container-apps/sessions-code-interpreter#preinstalled-packages). 

Scenarios 

The Dev Box Serverless GPU Compute feature is designed to support a wide range of CLI-driven tasks that benefit from on-demand, high-performance compute. This flexibility allows developers to run a variety of compute-intensive workflows without the need for dedicated GPU infrastructure. Some key scenarios include: 

AI Model Training and Inference: On-demand GPU access for tasks like training large models, fine-tuning, and running inference workloads. 

Data Processing and Preprocessing: Accelerated data manipulation and transformation for large datasets. 

High-Performance Computing (HPC): Support for simulations, scientific computations, and other resource-intensive tasks. 

Cloud-Native Development: Scaling GPU resources for cloud-native, containerized workflows in AI and beyond. 

CLI-Based Workflows: Developers can leverage GPUs for any other CLI-based task that benefits from intensive compute, whether for AI, simulations, or other specialized domains. 

Why Dev Box? 

Dev Box brings several key advantages to enterprises looking to leverage serverless GPU compute for AI and other compute-heavy tasks: 

No Need for Resource Creation Permissions: In many enterprises, developers lack access to the broader cloud infrastructure or the permissions required to create and manage GPU resources like ACA instances. With Dev Box, developers can access serverless GPU compute without needing to manage or create the underlying resources themselves. 

Instant Access to GPU Compute: Dev Box allows developers to get up and running with serverless GPU compute with just a single click. There's no need for manual configuration or setup, ensuring developers can focus on their work rather than worrying about infrastructure. 

Centralized Control for Admins: Dev Box integrates seamlessly with Dev Center's project policies, giving administrators granular control over serverless GPU access. Admins can define consumption limits, enable or disable GPU access on a per-project basis, and set permissions for users, all within the familiar Dev Center infrastructure. 

Secure Private Network Integration: Dev Box runs within a private, enterprise-managed network. This ensures that sensitive corporate data used for AI workloads—such as proprietary models, internal datasets, or compliance-bound information—remains isolated and secure at the network layer. This added layer of security is crucial for enterprises handling regulated or confidential data. 
