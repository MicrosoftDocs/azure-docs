---
title: Create a custom HTTP/HTTPS health probe for Azure Load Balancer
titleSuffix: Azure Load Balancer
description: Learn to create a custom HTTP/HTTPS health probe for Azure Load Balancer using python and FLASK restful server library.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: troubleshooting
ms.date: 05/22/2023
ms.author: mbender
---

# Create a custom HTTP/HTTPS health probe for Azure Load Balancer

In this tutorial we will be utilizing python and the FLASK restful server library to create our custom API for HTTP health probes. In addition, to check the CPU utilization of a VM, we will be using the psutil library.

HTTP/HTTPS health probes allow users to perform health checks on backend instances via a HTTP GET command at a specific path. Backend instances are marked as healthy if they return HTTP/HTTPS 200, otherwise the backend instance will be marked as unhealthy. 

HTTP/HTTPS health probes can be useful to implement your own logic to remove instances from a load balancer. In this tutorial, we will create a custom HTTP health probe that marks backend instances as unhealthy if their CPU utilization is over 75%.   

Disclaimer: While this example will base health probes off of CPU utilization, HTTP health probes can be utilized for a wide range of use-cases.  

## Pre-requisites

-  An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) and access to the Azure portal.
- An existing standard SKU Azure Load Balancer. For more information on creating a load balancer, see [Create a public load balancer using the Azure portal](quickstart-load-balancer-standard-public-portal.md).
- An Azure Virtual Machine running linux that is added to the backend pool of the Azure Load Balancer, see [Create a virtual machine using the Azure portal](../virtual-machines/linux/quick-create-portal.md).
- A linux virtual machine with python3 and pip installed.
- Remote access to the virtual machine via SSH or Azure Bastion.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

>

## Configure API on virtual machine

In this section, you'll configure the virtual machine to run the API that will be used for the HTTP health probe.

1. Log into the VM through SSH or Azure Bastion. In this tutorial we will be using Azure Bastion 
1. Create a new folder to store the code for the health API, and enter the new folder:

    ```bash
    mkdir health_API && cd health_API
    ``` 

1. Create a new python file and paste the code from above into the file:

    ```bash
    touch health.py && vim health.py
    ```

    ```python
    # Import libraries  
    from flask import Flask 
    from flask_restful import Resource, Api 
    import psutil 

    # Define app and API 
        app = Flask(__name__) 
        api = Api(app) 

    # Define API GET method 
    class check_CPU_VM(Resource): 
        def get(self):
            # If VM CPU utilization is over 75%, throw an error 
            if psutil.cpu_percent() >= 75.0:
                return '',408 
            # Else keep the VM as healthy 
            else: 
                return '',200 
         
    # Add the GET method to the API at the path 'health_check' 
    api.add_resource(check_CPU_VM, '/health_check/') 

    # Expose the API on all available IP address on the VM 
    if __name__ == "__main__":
        app.run(debug=True, host ="0.0.0.0") 
    ```
1. Once you have copied the code into the file, ensure that python3 and the required packages are installed (flask, flask_restful, psutil). If any packages aren’t installed, please install them using pip. 

    ```bash
    #Install Python
    sudo apt-get update
    sudo apt-get install python3
    sudo apt-get install python3-pip
    pip3 install flask flask_restful psutil
    ```
1. Run the API using the following command:

    ```bash
    python3 health.py
    ```
1. Once the API starts running you will see two IP addresses that are exposed to the API on port **5000**.
    - The first IP address is the local IP address that is only available to the VM.
    - The second IP address is the private IP address of the VM, the Load Balancer’s health probe will ping this IP address.

    :::image type="content" source="media/howto-create-custom-health-probe/running-api-output-thumb.png" alt-text="Screenshot of output from running API for health probe." lightbox="media/howto-create-custom-health-probe/running-api-output.png":::

> [!NOTE] 
> The API will need to be running on the VM for the health probe to work. When you close the SSH session, the API will stop running. Keep the window open while creating the health probe or run the API in the background.

## Create health probe

In this section, you'll create the health probe that will be used to check the health of the backend instances using the API created in the previous section.

1. Navigate to the Azure portal and select the load balancer that you would like to add the health probe to.
1. Select **Health probes** under **Settings**.
1. Select **+ Add**.
1. In the **Add Health Probe** page, enter or select the following information:

    | **Setting** | **Value** |
    | --- | --- |
    | **Name** | Enter **HTTP_Health** |
    | **Protocol** | Select **HTTP** |
    | **Port** | Enter **5000** |
    | **Path** | Enter **/health_check/** |
    | **Interval (seconds)** | Enter **5** |

1. Select **OK** to create the health probe.

## Test health probe

In this section, you'll test the health probe by adding it to the load balancer and checking the health of the backend instance.

1. Navigate to the Azure portal and select the load balancer that you would like to add the health probe to.
1. Se
## Clean up resources

## Next steps
