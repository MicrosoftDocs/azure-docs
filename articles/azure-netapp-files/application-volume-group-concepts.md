---
title: Understand application volume groups for Azure NetApp Files 
description: Learn about key concepts, functions, and best practices for application volume groups on Azure NetApp Files.   
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 01/31/2024
ms.author: anfdocs
---
# Understand application volume groups for Azure NetApp Files 

Understanding how application volume groups function is crucial for managing data and optimizing storage solutions. Learn about key concepts, functions, and best practices for application volume groups on Azure NetApp Files. 

An application volume group (AVG) is a framework designed to streamline the deployment of application volumes. It acts as a cohesive entity, bringing together related volumes to enhance efficiency, optimizing volume placement relative to compute resources, and improving administration.

AVG provides technical improvements to simplify and standardize the process to help you deploy your application. AVG also ensures that volumes are created with optimal placement in the regional or zonal infrastructure and provides key capabilities including: 

* supporting database configurations for both single and multiple host setups,
* creating volumes in a manual QoS capacity pool,
* and proposing a volume naming convention based on application ID and volume purpose. 

AVGs standardize and optimize the deployment of Azure NetApp Files volumes for use with specific applications according to best practices for those applications. To deploy, you provide inputs including specific application identifiers, number of data, log, binary and backup volumes in addition to their capacity and performance requirements. AVG deploys the volumes in one atomic operation using a predefined naming convention that allows you to easily identify the application and purpose of the volumes. 

## Essential components 

To understand how AVGs work, you should understand the different components. 

### Volumes 

The fundamental building blocks within an application volume group are individual volumes. These volumes store application data and are organized based on specific characteristics or usage patterns.

This diagram captures an example layout of volumes deployed by AVG, which includes application volume groups provisioned in a secondary availability zone. 

:::image type="content" source="./media/application-volume-group-concepts/application-volume-group-layout.png" alt-text="Diagram of volume layout in application volume groups." lightbox="./media/application-volume-group-concepts/application-volume-group-layout.png":::

<!-- 
The volumes are named by the application volume group based on your inputs about volume function. 

:::image type="content" source="../media/azure-netapp-files/volume-name-diagram.png" alt-text="Diagram volume naming conventions." lightbox="../media/azure-netapp-files/volume-name-diagram.png":::
-->

### Grouping logic

Application volume group employs a logical grouping mechanism, allowing administrators to categorize and deploy volumes based on shared attributes such as application type and application specific identifiers. 

#### Volume placement

Volumes are placed following best practices and in optimal infrastructure locations ensuring the best application performance from small to large scale deployments. Selected availability zone, available network capacity, and storage capacity determine infrastructure locations. Volumes that require the highest throughput and lowest latency (such as data and log volumes) are spread across available storage endpoints to mitigate network contention.

#### Policies

Application volume group operates under predefined policies that govern the behavior of the grouped volumes. These policies include performance optimization, data protection mechanisms, and scalability rules, which cannot be followed using individual volume deployment.

In resource-constrained regions, application volume group may deploy volumes on shared storage endpoints following these deployment rules:

[!INCLUDE [AVG bullet points](includes/application-volume-group-layout.md)]

The following diagram shows a volume layout in a resource-constrained 

:::image type="content" source="./media/application-volume-group-concepts/resource-constrained-layout.png" alt-text="Diagram of resource-constrained volume layout." lightbox="./media/application-volume-group-concepts/resource-constrained-layout.png":::

## Functionality

AVG offers multiple functionalities to benefit your application deployment. 

### Performance optimization

AVG facilitates the optimization of application performance by selecting optimal volume locations and corresponding storage endpoints to achieve the lowest possible latency. Allowing administrators to manage related volumes collectively also facilitates optimized application performance. This management can involve dynamically adjusting storage resources, load balancing, and implementing performance best practices.

### Data protection

Ensuring the integrity and availability of data is a paramount concern. AVG enables the application of consistent data protection policies across associated volumes, including snapshots, backups, and replication.

### Scalability

As applications evolve, they require scalable storage solutions. AVG supports seamless scalability. You can resize capacity and throughput of volumes within the group without disrupting application availability.

## Best practices

When using AVG, follow best practices to ensure optimal performance. 

### Define clear grouping criteria 

Establish well defined criteria for grouping volumes within an application volume group. Using defined criteria ensures that the logic applied aligns with the specific needs and characteristics of the associated application.

### Regular monitoring and optimization 

Implement a proactive monitoring strategy to assess the performance of volumes within an application volume group. Regularly optimize resource allocations and policies based on changing application requirements.

### Documentation and communication

Maintain comprehensive documentation outlining application volume group configurations, policies, and changes made to configurations or policies. Effective communication regarding application volume group structures is vital for collaborative management.

## Benefits of using application volume group

Volumes deployed by application volume group are placed in the regional or zonal infrastructure to achieve optimized latency and throughput for the application VMs. The deployed volumes provide the same flexibility for resizing performance and throughput as individually created volumes. Also like individually created volumes, the deployed volumes support data protection solutions including snapshots, cross-zone replication, and cross-region replication. 

AVG is available for SAP HANA and Oracle databases.

## Conclusion

AVG is a pivotal tool in modern data management, providing a structured approach to handling volumes within application environments. By leveraging AVG, you can enhance performance, streamline administration, and ensure the resilience of your applications in dynamic and evolving scenarios.

## Next steps

* [Understand application volume group for SAP HANA](application-volume-group-introduction.md)
* [Requirements and considerations for Application volume group for SAP HANA](application-volume-group-considerations.md)
* [Understand application volume group for Oracle](application-volume-group-oracle-introduction.md)
* [Requirements and considerations for application volume group for Oracle](application-volume-group-oracle-considerations.md)