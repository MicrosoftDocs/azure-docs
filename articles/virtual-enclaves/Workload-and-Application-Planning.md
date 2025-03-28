---
title: Workload and Application Planning
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

This will likely be split into multiple pages and reorganized

# Workload and Application Planning
The steps and consideration needed to plan a successful workload or application deployment into a Azure Virtual Enclave (AVE).

## Which Apps make good RemoteApps (Streaming Apps)?
This section describes the types of applications that are well-suited for remote streaming. It should include information on the benefits of using remote streaming, and how to set up a remote streaming environment.

1. Client Apps - Apps that install on a windows desktop (or Windows Server) and appear in the start menu. Apps installed for the whole VM work best rather than user installations.
1. File Based Apps - Apps that save output to a file (.txt, .docx., .drawio, etc.)
1. Simplified licensing - Licenses that allow for a max number of concurrent users works best. Licenses tied to individual users are complicated as Streaming Apps.

## Application Decision Tree
This section should provide a decision tree that can be used to determine the best deployment strategy for a given application. It should include questions about the application’s requirements, the expected number of users, and the expected load on the application.

![Workload-Decision-Tree.png](/assets/Workload-Decision-Tree-8d9b09f0-8eae-4393-afd6-fe6db9d91097.png)

## When to consider a Streaming Desktop instead?
This section describes the situations in which a streaming desktop might be a better option than a remote streaming application. It should include information on the benefits of using a streaming desktop, and how to set up a streaming desktop environment.

## Application Types (User Facing)
This section describes the different types of applications that can be deployed to the cloud, such as web applications and desktop applications. It should also include information on the different programming languages and frameworks that can be used to develop these applications.

1. Client/Desktop Apps
1. Web Apps

### Backend Apps
There are also applications or infrastructure to support applications on the backend (not user facing). These could include databases, backend servers, and admin tools 

## Users and Load
This section describes the expected number of users and the expected load on the application. It should also include information on how to handle surges and peaks in traffic.

### Number of concurrent Users
The number of users using the app at the same time (concurrent users) will determine the application VM size needed to maintain performance for those users. The App developer should have guidance on how to size the initial deployment for the number of users you expect. An initial VM size can be selected for the initial deployment and most applications will allow resizing of that VM (e.g. through the Azure Portal). Some apps that are tightly coupled to the hardware may have more trouble.

### Load
The load a user will put on the application is another consideration for sizing the VM appropriately. A couple of Power Users stressing an application could require more resources than many users lightly using an application. However, if the power users are infrequently using the application their application VM could be turned off most of the time whereas the multi-user app might stay on during business and maintenance hours.

## Artifacts (binaries) and Dependencies
This section describes the artifacts and dependencies required to deploy the application to the cloud. It should include information on how to package the application and its dependencies, and how to manage versioning.

### Download Artifacts in Advance
An important step is gathering the artifacts needed for the installation before files are transferred to the production environment. Testing the installation in a similar environment is also very helpful to make sure all artifacts were collected.

### Types of Artifacts
1. App installer binary file (.exe, .msi, etc.)
1. App dependencies (C++, java, GPU drivers, etc.)
1. Addons/Plugins/Modules - downloads that add additional features to an application

## App specific considerations
This section describes any application-specific considerations that need to be taken into account when deploying to the cloud. This could include things like data storage requirements, security considerations, and performance requirements.

## Maintenance
This section describes the ongoing maintenance required to keep the application running smoothly in the cloud. It should include information on how to monitor the application, how to perform updates and upgrades, and how to handle any issues that arise.

## Security
This section describes the security considerations that need to be taken into account when deploying an application to the cloud. It should include information on how to secure the application and its data, and how to handle security breaches.

## Access Control
This section describes the access control mechanisms that need to be put in place to ensure that only authorized users have access to the application and its data.

## Licenses
This section describes any licensing requirements that need to be taken into account when deploying the application to the cloud. It should include information on how to obtain and manage licenses for any third-party software used by the application.

## Networking
This includes topics such as network topology, IP addressing, and network security.

## Storage
This includes topics such as data storage, backup and recovery, and disaster recovery.

## Monitoring and Logging
This includes topics such as performance monitoring, log analysis, and alerting.

## Scaling
This includes topics such as scaling up and down, load balancing, and auto-scaling.

## Testing
This includes topics such as unit testing, integration testing, and performance testing.

## Deployment
This includes topics such as deployment automation, continuous integration and delivery, and containerization.
