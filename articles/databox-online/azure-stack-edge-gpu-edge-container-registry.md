---
title: Enable an Edge container registry on Azure Stack Edge Pro GPU device
description: Describes how to enable a local Edge container registry on Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 11/06/2020
ms.author: alkohli
---
# Enable Edge container registry on your Azure Stack Edge Pro GPU device

Edge container registry on your Azure Stack Edge Pro device is a managed, registry service based on the open-source Docker Registry 2.0. You use this registry to store and manage your private Docker container images and related artifacts. 

This article describes how to enable this local Edge container registry and use it from within the Kubernetes cluster on your Azure Stack Edge Pro device. The example used in the article details how to push an image from a source registry, in this case, Microsoft Container registry, to the registry on the Azure Stack Edge device, the Edge container registry.


## Prerequisites

Before you begin, make sure that:

1. You've access to an Azure Stack Edge Pro device.

2. You've activated your Azure Stack Edge Pro device as described in [Activate Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-activate.md).

3. You've enabled compute role on the device. A Kubernetes cluster was also created on the device when you configured compute on the device as per the instructions in [Configure compute on your Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-configure-compute.md).

4. You've access to a Windows client system. You can have any other client with a [Supported operating system](azure-stack-edge-gpu-system-requirements.md#supported-os-for-clients-connected-to-device) as well.
    1. This system is running PowerShell 5.0 or later to access the device.
    1. This system has Docker for Windows installed to pull and push container images.  

5. You have the Kubernetes API endpoint from the **Device** page of your local web UI. For more information, see the instructions in [Get Kubernetes API endpoint](azure-stack-edge-gpu-deploy-configure-compute.md#get-kubernetes-endpoints).


## Enable container registry as add-on

The first step is to enable the Edge container registry as an add-on.

- Run PowerShell as an administrator on your Windows client that you will use to access your Azure Stack Edge device. [Connect to the PowerShell interface of the device](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface). 

1. To enable the container registry as an add-on, type: 

    `Set-HcsKubernetesContainerRegistry`
	
    This operation may take several minutes to complete.

    Here is the sample output of this command:	
			
    ```powershell
    [10.128.44.40]: PS>Set-HcsKubernetesContainerRegistry
	Operation completed successfully. Use Get-HcsKubernetesContainerRegistryInfo for credentials    
    ```
			
1. To get the container registry details, type:

    `Get-HcsKubernetesContainerRegistryInfo`

    Here is the sample out of this command:  
	
    ```powershell
    [10.128.44.40]: PS> Get-HcsKubernetesContainerRegistryInfo
    			
    Endpoint                                   IPAddress    Username     Password
    --------                                   ---------    --------     --------
    ecr.dbe-hw6h1t2.microsoftdatabox.com:31001 10.128.44.41 ase-ecr-user i3eTsU4zGYyIgxV
    ```	

1. Make a note of the username and the password from the output of `Get-HcsKubernetesContainerRegistryInfo`. These credentials are used to sign in to the Edge container registry while pushing images.			


## Access container registry from outside

You may want to access the container registry from outside of your Azure Stack Edge device. Follow these steps to access Edge container registry:

1. Get the endpoint details for the Edge container registry.
    - In the local UI of the device, go to **Device**.
    - Locate the **Edge container registry endpoint**.
        ![Edge container registry endpoint on Device page](media/azure-stack-edge-gpu-edge-container-registry/get-ecr-endpoint-1.png) 
    - Copy this endpoint and create a corresponding DNS entry into the `C:\Windows\System32\Drivers\etc\hosts` file of your client to connect to the Edge Container registry endpoint. 

        <IP address of the Kubernetes master node>    <Edge container registry endpoint> 
        
        ![Add DNS entry for Edge container registry endpoint](media/azure-stack-edge-gpu-edge-container-registry/add-dns-entry-hosts-1.png)    

1. Download the Edge container registry certificate from Local UI. 
    - In the local UI of the device, go to **Certificates**.
    - Locate the entry for **Edge container registry certificate**. To the right of this entry, select the **Download** to download the Edge container registry certificate on your Windows client system that you'll use to access your device. 

        ![Download edge container registry endpoint certificate](media/azure-stack-edge-gpu-edge-container-registry/download-ecr-endpoint-certificate-1.png)  

1. Install the downloaded certificate on the Windows client. 
    - Select the certificate and double-click it. 
    - Install the certificate on your Local machine in the trusted root store. 
    - 

1. After the certificate is installed, restart the Docker on your system.

1. Log into the Edge container registry. Type:

    `docker login <Edge container registry endpoint> -u <username> -p <password>`

    Provide the Edge container registry endpoint from the **Devices** page and <username> and <password> that you got from the output of `Get-HcsKubernetesContainerRegistryInfo`. 

1. Use docker push or pull commands to push or pull container images from the container registry.
 
    1. Pull an image from the Microsoft Container Registry image. Type:
        
        `docker pull <Full path to the container image in the Microsoft Container Registry>`
       
    1. Create an alias of the image you pulled with the fully qualified path to your registry.

        `docker tag <Path to the image in the Microsoft container registry> <Path to the image in the Edge container registry/Image name with tag>`

    1. Push the image to your registry.
    
        `docker push <Path to the image in the Edge container registry/Image name with tag>`

    1. Run the image you pushed into your registry.
    
        `docker run -it --rm -p 8080:80 <Path to the image in the Edge container registry/Image name with tag>`

        Here is a sample output of the pull and push commands:

        ```powershell
        PS C:\WINDOWS\system32> docker login ecr.dbe-hw6h1t2.microsoftdatabox.com:31001 -u ase-ecr-user -p 3bbo2sOtDe8FouD
        WARNING! Using --password via the CLI is insecure. Use --password-stdin.
        Login Succeeded
        PS C:\WINDOWS\system32> docker pull mcr.microsoft.com/oss/nginx/nginx:1.17.5-alpine
        1.17.5-alpine: Pulling from oss/nginx/nginx
        Digest: sha256:5466bbc0a989bd1cd283c0ba86d9c2fc133491ccfaea63160089f47b32ae973b
        Status: Image is up to date for mcr.microsoft.com/oss/nginx/nginx:1.17.5-alpine
        mcr.microsoft.com/oss/nginx/nginx:1.17.5-alpine
        PS C:\WINDOWS\system32> docker tag mcr.microsoft.com/oss/nginx/nginx:1.17.5-alpine ecr.dbe-hw6h1t2.microsoftdatabox.com:31001/nginx:2.0
        PS C:\WINDOWS\system32> docker push ecr.dbe-hw6h1t2.microsoftdatabox.com:31001/nginx:2.0
        The push refers to repository [ecr.dbe-hw6h1t2.microsoftdatabox.com:31001/nginx]
        bba7d2385bc1: Pushed
        77cae8ab23bf: Pushed
        2.0: digest: sha256:b4c0378c841cd76f0b75bc63454bfc6fe194a5220d4eab0d75963bccdbc327ff size: 739
        PS C:\WINDOWS\system32> docker run -it --rm -p 8080:80 ecr.dbe-hw6h1t2.microsoftdatabox.com:31001/nginx:2.0
        2020/11/10 00:00:49 [error] 6#6: *1 open() "/usr/share/nginx/html/favicon.ico" failed (2: No such file or directory), client: 172.17.0.1, server: localhost, request: "GET /favicon.ico HTTP/1.1", host: "localhost:8080", referrer: "http://localhost:8080/"
        172.17.0.1 - - [10/Nov/2020:00:00:49 +0000] "GET /favicon.ico HTTP/1.1" 404 555 "http://localhost:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36" "-"
        ^C
        PS C:\WINDOWS\system32>
        
        ```
    1. Browse to `http://localhost:8080` to view the running container. In this case, you will see the nginx webserver running.

        ![View the running container](media/azure-stack-edge-gpu-edge-container-registry/view-running-container-1.png)

        To stop and remove the container, press `Control+C`.
   

## Use Edge container registry images via Kubernetes pods

You can now use the image that you pushed in your Edge container registry from within the Kubernetes pods.

Configure cluster access via kubectl

The image pull secrets are already set in all K8s namespaces. Simply refer to them in your pod specification using imagePullSecrets with a name = ase-ecr-credentials
	
Deploy a pod to your namespace using kubectl. Replace the image: <image-name> with the image pushed to container registry

		apiVersion: v1
		kind: Pod
		metadata:
		  name: nginx
		spec:
		  containers:
		  - name: nginx
		    image: ecr.dbe-hw6h1t2.microsoftdatabox.com:31001/nginx:2.0
		    imagePullPolicy: Always
		  imagePullSecrets:
  - name: ase-ecr-credentials

After the Kubernetes cluster is created, you can use the *kubectl* via cmdline to access the cluster. In this approach, you:

- Create a namespace and a user. 
- Associate the user with the namespace. 
- Get the *config* file that allows you to use a Kubernetes client to talk directly to the Kubernetes cluster that you created without having to connect to PowerShell interface of your Azure Stack Edge Pro device.

Follow these steps:

1. Create a namespace. Type:

    `New-HcsKubernetesNamespace -Namespace <string>` 

    > [!NOTE]
    > For both namespace and user names, the [DNS subdomain naming conventions](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names) apply.

    Here is a sample output:

    `[10.100.10.10]: PS> New-HcsKubernetesNamespace -Namespace "myasetest1"`

2. Create a user and get a config file. Type:

    `New-HcsKubernetesUser -UserName <string>`

    > [!NOTE]
    > You can't use *aseuser* as the username as it is reserved for a default user associated with IoT namespace for Azure Stack Edge Pro.

    Here is a sample output of the config file:
   
    

## Next steps

- [Deploy a stateless application on your Azure Stack Edge Pro](azure-stack-edge-j-series-deploy-stateless-application-kubernetes.md).
