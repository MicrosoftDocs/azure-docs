---
title: Glossary for Azure Operator Service Manager
description: Learn about terminology specific to Azure Operator Service Manager.
author: sherrygonz
ms.author: sherryg
ms.date: 08/15/2023
ms.topic: glossary
ms.service: azure-operator-service-manager
---

# Glossary: Azure Operator Service Manager
The following article contains terms used throughout the Azure Operator Service Manager documentation.

## A

### Active
Active refers to a versionState of Network Function Definition or Network Service Design such that it's ready for use. An Active resource is immutable and can be deployed cross-subscription.

### Artifact
An artifact refers to a deployable component, such as a container image, Helm chart, Virtual Machine image or ARM template that is used in the deployment process. Artifacts are essential building blocks for deploying applications and services, providing the necessary files required for successful deployment.

### Artifact Manifest
The Artifact Manifest contains a dictionary of artifacts, in a given artifact store, together with type and version. A Publisher only uploads artifacts that are listed in the manifest.  The Artifact Manifest also handles credential generation for push access to the Artifact Store. The Artifact Manifest verifies if all the artifacts referenced by NSDVersions or NFDVersions are uploaded.

### Artifact Store
The Artifact Store serves as the Azure Resource Manager (ARM) resource responsible for housing all the resources needed to create Network Functions and Network Services. The Artifact Store acts as a centralized repository for various components, including:
- Helm charts.
- Docker images for Containerized Network Functions (CNF).
- Virtual Machine (VM) images for Virtualized Network Functions (VNF).
- Other assets like ARM templates required throughout the Network Function creation process.

It ensures proper storage and prevents accidental mismanagement like deleting images still in use by operators.

Artifact Store comes in two flavors:
1. Azure Storage Account for storing VM images.
1. Azure Container Registry for storing all other artifact types.

### Azure CLI
Azure CLI (Command-Line Interface) is a command-line tool provided by Azure that enables you to manage Azure resources and services. With Azure CLI, you can interact with Azure through commands automating tasks and managing resources efficiently.

### Azure Cloud Shell
Azure Cloud Shell is an interactive, browser-based shell environment provided by Azure. Azure Cloud Shell allows you to manage Azure resources using the CLI or PowerShell, without the need to install any more software. Azure Cloud Shell provides a convenient and accessible way to work with Azure resources from anywhere.

### Azure Container Registry (ARC)
Azure Container Registry (ACR) is a managed, private registry service provided by Azure for storing and managing container images.

### Azure Operator Service Manager (AOSM)
Azure Operator Service Manager is a service provided by Azure for managing and operating network functions and services. Azure Operator Service Manager (AOSM) provides a centralized platform for operators to deploy, monitor, and manage network functions. Azure Operator Service Manager (AOSM) simplifies the management and operation of complex network infrastructures.

### Azure portal
Azure portal is a web-based interface provided by Azure for managing and monitoring Azure resources and services. Azure portal provides a unified and intuitive user experience, allowing users to easily navigate and interact with their Azure resources.

## B

### Bicep
Bicep is a domain-specific language (DSL) provided by Azure for deploying Azure resources using declarative syntax. Bicep templates are easier to write than Azure Resource Manager (ARM) templates. It's possible to convert Bicep templates to Azure Resource Manager (ARM) and vice-versa.

## C

### Configuration Group Schema (CGS)
Configuration Groups are partitions of the Site Network Service (SNS) configuration defined by each Network Service Design Version (NSDV). The Configuration Group Schema (CSG) is a json schema, defining the format of these inputs. The Service Designer creates one or more Configuration Group Schemas (CSGs) in the process of creating a Network Service Design Version (NSDV).

### Configuration Group Values (CGV)
Configuration Group Values (CGV) are json blobs that define the inputs parameters for the Site Network Service (SNS).  There are one or more Configuration Group Values (CGVs) associated with each Site Network Service (SNS).  The contents of a Configuration Group Value (CGV) must adhere to the Configuration Group Schema (CGS) associated with the Network Service Design Version (NSDV) selected for the Site Network Service (SNS).

### Containerized Network Function (CNF)
A Containerized Network Function (CNF) is a network function described by Helm charts and delivered as container images. Azure Operator Service Manager (AOSM) supports CNFs on Arc-enabled Kubernetes clusters and AKS.

### Contributor Role
Contributor Role is a role in Azure that grants users permissions to manage and make changes to Azure resources within a subscription. Users with the Contributor Role have the ability to create, modify, and delete resources, providing them with the necessary permissions to effectively manage Azure resources.

### Custom Location Id
Custom Location Id is a unique identifier used to specify a custom location for deploying resources in Azure. Custom Location Id allows users to define and deploy resources in specific locations not predefined by Azure, providing flexibility and customization options.

## D

### Docker
Docker is an open-source platform that allows you to automate the deployment and management of applications within containers. Containerized Network Function (CNF) images are docker images and Helm charts describe the deployment of these images.

## H

### Helm
Helm is a package manager for Kubernetes that uses preconfigured packages called charts.

### Helm chart
A Helm chart is a collection of files that describe a set of Kubernetes resources and their configurations, allowing for easy application deployment and management. Helm charts provide a templated approach to defining and deploying applications in Kubernetes.

### Helm package
A Helm package is a compressed archive file that contains all the files and metadata required to deploy an application using Helm.

## I

### Immutable
Immutable refers to a state or condition that can't be changed or modified. In the context of Azure resources, immutability ensures that the resource's configuration and state remain unchanged, providing stability and consistency in the deployment and management of resources.

## J

### JSON
JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to read and write and easy for machines to parse and generate. JSON is commonly used for representing structured data, making it a popular choice for configuration files and data exchange between systems.

## L

### Linux
 Linux is an open-source operating system that is widely used in server environments and supports various software applications. Linux provides a stable and secure platform for running applications, making it a popular choice for cloud-based deployments.

## M

### Managed Identity
Managed Identity is a feature in Azure that provides an identity for a resource to authenticate and access other Azure resources securely. Managed Identity eliminates the need for managing credentials and simplifies the authentication process, ensuring secure and seamless access to Azure resources.

### Managed Identity Operator Role
Managed Identity Operator Role is a role in Azure that grants permissions to manage and operate resources using a managed identity. Users with the Managed Identity Operator Role have the ability to manage and operate resources using the associated managed identity, ensuring secure and controlled access to resources.

## N

### Network Function (NF)
Network Functions (NFs) come in two flavors: Containerized Network Function (CNFs) and Virtualized Network Functions (VNFs).  Network Functions are units of function that can be combined together into a service.

### Network Function Definition (NFD) / Network Function Definition Version (NFDV)
Network Function Definitions (NFDs) have multiple versions known as NetworkFunctionDefinitionVersions (NFDV). A NetworkFunctionDefinitionVersion is a template for deploying a network function on a particular version. Network Function Definitions and Network Function Definition Versions become immutable once set to 'Active. The Network Function (NF) Publisher on-boards a NetworkFunctionDefinitionVersion resource by providing binaries, configuration, and mapping rules.

The collection of all Network Function Definition Version (NFDVs) for a given Network Function (NF) is known as a Network Function Definition Group (NFDG).

### Network Function Virtualization Infrastructure (NFVI)
A Network Function Virtualization Infrastructure (NFVI) represents a location where a Network Function (NF) can be instantiated, such as a Custom location of an Arc-enabled Kubernetes cluster or an Azure region.

The name of the Network Function Virtualization Infrastructure (NFVI) defined in a Network Service Design (NSD) must match that of the Site used when deploying a Site Network Service (SNS).

### Network Function Manager (NFM)
Network Function Manager (NFM) is an Azure service responsible for managing and operating network functions in Azure. Azure Operator Service Manager uses Network Function Manager (NFM); NFM is opaque to the Publisher, Designer and Operator.

### Network Function Publisher (NFP)
Network Function Publisher (NFP) is an entity or organization that publishes and provides Network Functions (NFs) for deployment and use. Network Function Publishers (NFPs) play a crucial role in making Network Functions (NF) available to operators, ensuring a wide range of options for deploying and managing network services.  

### Network Service Design (NSD) / Network Service Design Group (NSDG) / Network Service Design Version (NSDV)
A Network Service Design (NSD) describes a network service of a specific type, created and uploaded by the Designer. A Network Service Design (NSD) is a composite of one or more Network Function Definitions (NFD) and any infrastructure components deployed at the same time. Network Service Designs (NSDs) have multiple versions (NSDVs). The Network Service Design Versions (NSDVs) include mapping rules, references to Config Group Schemas (CGS), resource element templates and Site information.

The collection of all Network Service Design Versions (NSDVs) for a given Network Service Design (NSD) is known as a Network Service Design Group (NSDG).

### Network Service Designer (NSD)
Network Service Designer (NSD) is a person or organization who creates a Network Service  Design.

### Network Service Operator (NSO)
Network Service Operator (NSO) is a person or organization responsible for operating and managing network services in Azure. They create Configuration Group Values (CGV), Sites and Site Network Services (SNS).

### Nginx Container (NC)
Nginx Container (NC) refers to a container that runs the Nginx web server, which is commonly used for serving web content. In the Azure Operator Service Manager (AOSM) Quickstart guides Nginx is used as an example of a Containerized Network Function (CNF).

## P

### Publisher
The Network Function (NF) Publisher is a person or organization that creates and publishes Network Functions (NFs) to Azure Operator Service Manager (AOSM).

The Publisher *resource* enables the onboarding of Network Functions (NFs) to Azure Operator Service Manager (AOSM) and the definition of Network Services composed from those Network Functions (NFs). The Publisher includes child resources:
- NSDVersions
- NFDVersions
- Config Group Schemas
- Artifact Store

You can upload container images and VHDs to the Artifact Store through the Publisher.

### Publisher Offering Location
Publisher Offering Location refers to the specific location or region where the publisher resource is deployed.

## R

### RBAC
RBAC (Role-Based Access Control) is a security model in Azure that defines and manages access to resources based on assigned roles. RBAC allows administrators to grant specific permissions to users or groups, ensuring secure and controlled access to Azure resources.

### Resource Group
A Resource Group is a logical container in Azure that holds related resources for easier management, security, and billing. Resource Group provides a way to organize and manage resources, allowing for efficient management and control of Azure resources.

### Resource ID
Resource ID is a unique identifier assigned to each resource in Azure, used to reference and access the resource. Resource IDs provide a way to uniquely identify and locate resources within Azure, ensuring accurate and reliable resource management.

### Resources
Resources refer to the various components, services, or entities that are provisioned and managed within Azure. Resources can include virtual machines, storage accounts, databases, and other services that are used to build and operate applications and infrastructure in Azure.

## S

### SAS URL
SAS URL (Shared Access Signature URL) is a URL that provides temporary access to a specific Azure resource or storage container. SAS URLs allow users to grant time-limited access to resources, ensuring secure and controlled access to Azure resources.

### Service Account
A Service Account is an account or identity used by an application or service to authenticate and access resources in Azure. Service accounts provide a way to securely manage and control access to resources, ensuring that only authorized applications or services can access sensitive data or perform specific actions.

### Service Port Configuration
Service Port Configuration refers to the configuration settings for the ports used by a network service. Service Port Configuration includes details such as the port numbers, protocols, and other settings required for the proper operation and communication of the network service.

### Site
A *Site* refers to a specific location, which can be either a single Azure region (a data center location within the Azure cloud) or an on-premises facility, associated with the instantiation and management of network services. A *Site* serves as the fundamental unit for making updates, where all changes are independently applied to individual sites. 

A *Site* encompasses the concept of global changes, wherein multiple independent operations are sequentially deployed across multiple sites, typically following safe deployment practices.

A *Site* is a collection of Network Function Virtualization Infrastructure (NFVIs) that are grouped together to form the platform on which a Site Network Service (SNS) runs.  Typically all the Network Function Virtualization Infrastructure (NFVIs) within a site are grouped together geographically (for example all within the same Azure Region or Nexus cluster), but there can be exceptions to this rule.

### Site Network Service (SNS)
A Site Network Service (SNS) consists of a collection of Network Functions (NFs) along with Azure infrastructure all working together to deliver a cohesive unit of service. A Site Network Service (SNS) is instantiated by selecting a Network Service Design Version (NSDV) and supplying parameters in the form or Configuration Group Values (CGVs) and a Site.

### SSH
SSH (Secure Shell) is a cryptographic network protocol used for secure remote access to systems and secure file transfers. SSH provides a secure and encrypted connection between a client and a server, ensuring the confidentiality and integrity of data transmitted over the network.

### Subscription
A Subscription is a billing and management container in Azure that holds resources and services used by an organization. Subscriptions provide a way to organize and manage resources, allowing for efficient billing, access control, and management of Azure resources.

## T

### Tenant
A Tenant refers to an organization or entity that owns and manages a Microsoft Entra ID instance. Tenants provide a way to manage and control access to Azure resources, ensuring secure and controlled access for users and applications.

## U

### User Assigned Identity
User Assigned Identity is an Azure feature that allows you to assign an identity to a specific user or application for authentication and access control. User Assigned Identities provide a way to manage and control access to resources, ensuring secure and controlled access for users and applications.

## V

### Virtualized Network Function (VNF)
A Virtualized Network Function (VNF) is a Network Function (NF) described by an Azure Resource Manager (ARM) template and delivered as a VHD. Azure Operator Service Manager (AOSM) supports Virtualized Network Functions (VNFs) deployed on Azure Core and Operator Nexus.
