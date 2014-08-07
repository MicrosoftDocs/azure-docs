<properties linkid="develop-net-architecture sublanding" urlDisplayName="" pageTitle="Architecture" metaKeywords="" description="Architecture overview that covers common design patterns" metaCanonical="" services="" documentationCenter="" videoId="" scriptId="" title="Architecture Overview" authors="robb" solutions="" manager="dongill" editor="mattshel" />

<tags ms.service="multiple" ms.workload="na" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="robb" />

#Architecture
Learn how to implement common design patterns in Azure.

###Azure Symbol/Icon set

[Download the Azure Symbol/Icon set](http://www.microsoft.com/en-us/download/details.aspx?id=41937) to create technical materials that describe (or use) Azure—things like architecture diagrams, training materials, presentations, datasheets, infographics, and whitepapers. You can download the symbols in PPT, Visio, or PNG formats. We’d like to know what you think, so there are instructions for providing feedback in the download.

![Azure Symbol/Icon set][azure_symbols]

##Design patterns

###[Competing Consumers](http://msdn.microsoft.com/en-us/library/dn568101.aspx)

![Competing Consumers][competing_consumers]

Enable multiple concurrent consumers to process messages received on the same messaging channel. This pattern enables a system to process multiple messages concurrently to optimize throughput, to improve scalability and availability, and to balance the workload. 

###[Command and Query Responsibility Segregation](http://msdn.microsoft.com/en-us/library/dn568103.aspx)

![Command and Query Responsibility Segregation][cqrs]

Segregate operations that read data from operations that update data by using separate interfaces. This pattern can maximize performance, scalability, and security; support evolution of the system over time through higher flexibility; and prevent update commands from causing merge conflicts at the domain level.

###[Leader Election](http://msdn.microsoft.com/en-us/library/dn568104.aspx)

![Leader Election][leader_election]

Coordinate the actions performed by a collection of collaborating task instances in a distributed application by electing one instance as the leader that assumes responsibility for managing the other instances. This pattern can help to ensure that task instances do not conflict with each other, cause contention for shared resources, or inadvertently interfere with the work that other task instances are performing.

###[Pipes and Filters](http://msdn.microsoft.com/en-us/library/dn568100.aspx)

![Pipes and Filters][pipes_and_filters]

Decompose a task that performs complex processing into a series of discrete elements that can be reused. This pattern can improve performance, scalability, and reusability by allowing task elements that perform the processing to be deployed and scaled independently.

###[Valet Key](http://msdn.microsoft.com/en-us/library/dn568102.aspx)

![Valet Key][valet_key]

Use a token or key that provides clients with restricted direct access to a specific resource or service in order to offload data transfer operations from the application code. This pattern is particularly useful in applications that use cloud-hosted storage systems or queues, and can minimize cost and maximize scalability and performance.

### Additional Guidance

For information on more common design patterns in Azure, see [Cloud Design Patterns](http://msdn.microsoft.com/en-us/library/dn568099.aspx).


[competing_consumers]: ./media/architecture-overview/CompetingConsumers.png
[cqrs]: ./media/architecture-overview/CQRS.png
[leader_election]: ./media/architecture-overview/LeaderElection.png
[pipes_and_filters]: ./media/architecture-overview/PipesAndFilters.png
[valet_key]: ./media/architecture-overview/ValetKey.png
[azure_symbols]: ./media/architecture-overview/AzureSymbols.png
