To build and run modern applications and services in the cloud, developers typically use containers and microservices. Azure supports many common container solutions such as Docker, Kubernetes, DC/OS, and Service Fabric. You can quickly create single containers with Azure Container Instances, deploy a complete infrastructure with Azure Container Services, and store and use containers images from Azure Container Registry. This articles introduces some of the container solutions that you can use in Azure.


## Docker on virtual machines
[Docker](https://www.docker.com) is a popular container management and imaging platform that allows you to quickly work with containers. Azure VMs as Docker hosts are a good option for development and test environments, or if you wish to build and manage your own production clusters and orchestration solutions. On Linux VMs, you can use cloud-init or the Azure Docker VM extension to create a VM and automatically configure it as a Docker host. 

Learn how to:

- [Create a Linux VM with the Azure Docker VM extension](../articles/virtual-machines/linux/dockerextension.md).
- [Use cloud-init to install packages on a Linux VM](../articles/virtual-machines/linux/tutorial-automate-vm-deployment.md)

### Docker Machine
[Docker Machine](https://docs.docker.com/machine/overview/) allows you to use tools on your local machine to create and manage Docker hosts in Azure. The Docker Machine client creates VMs in Azure, then installs the Docker Engine. This approach allows you to perform all the maintenance and management from a single tool on your local machine, and seamlessly across multiple Azure VM Docker hosts.

Learn how to:

- [Use Docker Machine to create a Docker VM host](../articles/virtual-machines/linux/docker-machine.md)

### Docker Compose
[Docker Compose](https://docs.docker.com/compose/overview/) lets you define your container applications and services in a single file. This Compose file includes the Docker image to use, any ports to expose, or storage volumes to connect. Compose files are a good way to create consistent application deployments across platforms. You can use Compose files to create application deployments on Docker hosts in Azure.

Learn how to:

- [Deploy a multi-tier container application with Compose on a Docker VM host](../articles/virtual-machines/linux/docker-compose-quickstart.md)


## Azure Container Instances
Azure Container Instances allow you to run a single container instance without the overhead of creating and managing a Docker host or multi-node orchestrated environment. You can run both Linux and Windows containers, and only pay by the second for their use. Public connectivity to containers is provided, and you can connect persistent Azure storage to your container instances. As you do not provision the underlying container infrastructure, Azure Container Instances start in seconds. Azure Container Instances integrate with Azure Container Registry.

Learn how to:

- [Create an Azure Container Instance](../articles/container-instances/container-instances-quickstart.md)
- [Create an Azure Container Instance from an image in Azure Container Registry](../articles/container-instances/container-instances-tutorial-deploy-app.md)


## Kubernetes on Azure Container Service
[Kubernetes](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/) is an open-source platform that allows you to automate and orchestrate a container infrastructure. Additional tools and platforms such as Deis and Openshift leverage Kubernetes, which gives you choice and flexibility in how to manage and run your applications and services. You can build your own infrastructure with Docker hosts and Kubernetes, or use Azure Container Service for a centralized deployment.

[Azure Container Service](../articles/container-service/kubernetes/container-service-intro-kubernetes.md) is an open platform that uses the Docker container format that creates the underlying container infrastructure environment for you. The Azure platform creates and manages the VM resources, storage, and network, allowing you to focus on the applications themselves and continue to use native tools. The underlying [ACS Engine is open-sourced](https://github.com/Azure/acs-engine) if you would like to build and customize the engine.

Learn how to:

- [Get started with Kubernetes in Azure](../articles/container-service/kubernetes/container-service-kubernetes-walkthrough.md)


## DC/OS on Azure Container Service
[DC/OS](https://dcos.io/) is an open-source platform to manage container hosts, applications and services, and VMs. You can build your own infrastructure with Docker hosts and DC/OS, or use Azure Container Service for a centralized deployment.

[Azure Container Service](../articles/container-service/dcos-swarm/container-service-intro.md) is an open platform that uses the Docker container format that creates the underlying container infrastructure environment for you. The Azure platform creates and manages the VM resources, storage, and network, allowing you to focus on the applications themselves and continue to use native tools. The underlying [ACS Engine is open-sourced](https://github.com/Azure/acs-engine) if you would like to build and customize the engine.

Learn how to:

- [Get started with DC/OS in Azure](../articles/container-service/dcos-swarm/container-service-dcos-quickstart.md)


## Docker Swarm on Azure Container Service
[Docker Swarm](https://docs.docker.com/engine/swarm/key-concepts/) is a cluster solution that allows Docker hosts to work together and orchestrate container services and deployments. You can build your own infrastructure with Docker hosts and Swarm, or use Azure Container Service for a centralized deployment.

[Azure Container Service](../articles/container-service/dcos-swarm/container-service-intro.md) is an open platform that uses the Docker container format that creates the underlying container infrastructure environment for you. The Azure platform creates and manages the VM resources, storage, and network, allowing you to focus on the applications themselves and continue to use native tools. The underlying [ACS Engine is open-sourced](https://github.com/Azure/acs-engine) if you would like to build and customize the engine.

Learn how to:

- [Get started with Docker Swarm in Azure](../articles/container-service/dcos-swarm/container-service-swarm-walkthrough.md)


## Docker CE (Preview) on Azure Container Service
[Docker CE](https://www.docker.com/community-edition) is a community supported edition of Docker. New Docker Swarm mode features are included with Docker CE, which allows you to better manage and orchestrate your applications and services. You can build your own infrastructure with Docker hosts, or use Azure Container Service for a centralized deployment.

[Azure Container Service](../articles/container-service/dcos-swarm/container-service-intro.md) is an open platform that uses the Docker container format that creates the underlying container infrastructure environment for you. The Azure platform creates and manages the VM resources, storage, and network, allowing you to focus on the applications themselves and continue to use native tools. The underlying [ACS Engine is open-sourced](https://github.com/Azure/acs-engine) if you would like to build and customize the engine.

Learn how to:

- [Get started with Docker CE in Azure](../articles/container-service/dcos-swarm/container-service-swarm-mode-walkthrough.md)


## Service Fabric
[Service Fabric](../articles/service-fabric/service-fabric-overview.md) is Microsoft's container orchestrator to deploy microservices across a cluster of machines. You can package, deploy, and manage scalable and reliable microservices and containers without worrying about the underlying infrastructure. You can deploy and activate services as processes or within Windows and Linux containers. Service Fabric powers many Microsoft services today, including Azure SQL Database, Azure IoT Hub, and Skype for Business.

Learn how to:

- [Get started with a .NET application in Service Fabric](../articles/service-fabric/service-fabric-quickstart-dotnet.md)


## Azure Container Registry
Azure Container Registry allows you to create, store, and manage your private Docker container images in a secured central location. These container images can then be used as part of deployment workflows in Azure Container Service deployments and Azure Container Instances, as well as local development environments or external container platforms. Tags can be used to maintain multiple versions of images as needed to support your application lifecycle and continuous deployment. A managed registry adds features such as additional storage tiers for improved reliability, webhook integration, and the use of Azure Active Directory authentication.

Learn how to:
- [Create an Azure Container Registry](../articles/container-registry/container-registry-get-started-portal.md)
- [Create a managed Azure Container Registry](../articles/container-registry/container-registry-managed-get-started-portal.md)
- [Use the Docker CLI to push and pull a container image with Azure Container Registry](../articles/container-registry/container-registry-get-started-docker-cli.md)


## Next steps
With Azure, you choose the container solution most appropriate for your environment and applications. We support the most popular open source platforms and frameworks that allows you to focus on your applications and services.

For information on Azure Container Service, see [Introduction to Azure Container Service for Kubernetes](../articles/container-service/kubernetes/container-service-intro-kubernetes.md). For more information on Service Fabric, see [What is Service Fabric?](../articles/service-fabric/service-fabric-overview.md)