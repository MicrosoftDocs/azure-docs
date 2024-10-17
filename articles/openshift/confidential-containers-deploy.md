---
title: Deploy Confidential Containers in an Azure Red Hat OpenShift (ARO) cluster
description: Discover how to deploy Confidential Containers in Azure Red Hat OpenShift (ARO)
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: confidential containers, aro, deploy, openshift, red hat
ms.topic: how-to
ms.date: 10/17/2024
ms.custom: template-how-to
---

# Deploy Confidential Containers in an Azure Red Hat OpenShift (ARO) cluster

This article describes the steps required to deploy Confidential Containers for an ARO cluster. This process involves two main parts and multiple steps:


**Part 1: Deploy OpenShift Sandboxed Containers**

1. Install the OpenShift Sandboxed Containers Operator.
    
    Create several manifest files and run commands to install and verify the Operator.

1. Create the peer pods secret.
    1. Gather necessary Azure credentials.
    1. Generate and record RBAC content.
    1. Create peer pods secret manifest file.

1. Create the peer pods config map.
    1. Create the peer pods config file.
    1. Create the ConfigMap.

1. Create the Azure secret.
    1. Generate SSH keys.
    1. Create a secret object.
    1. Delete the generated keys. 




**Part 2: Deploy Confidential Containers**

1.	Install the Trustee Operator: Create and apply manifests to install the operator.

1.	Create the route for the Trustee: Create a secure route with edge TLS termination for the Trustee service. 
    1. Run a command to create the route.
    1. Set and record the TRUSTEE_HOST variable.

1.	Enable the Confidential Containers feature gate: Create a config map to enable the Confidential Containers feature.

1.	Update the peer pods config map: 
    1. Retrieve necessary Azure resource information (resource group, VNet name, subnet ID, NSG ID, region) using Azure CLI commands.
    1. Create a YAML file containing the retrieved information and the TRUSTEE_HOST value.
    1. Run a command to apply the updated configuration.
    1. Restart the `peerpodconfig-ctrl-caa-daemon` daemon set.

1.	Create the KataConfig custom resource: Install kata-remote as the runtime class. 
    1. Create a YAML file defining the KataConfig configuration.
    1. Run a command to apply the configuration.
    1. Monitor and verify the installation process.

1.	Create the Trustee authentication secret: Generate private and public keys and create a secret object.

1.	Create the Trustee config map: This defines configuration for the Trustee service. 
    1. Create a YAML file containing the Trustee configuration.
    1. Run a command to apply the configuration.

1.	Configure attestation policies (optional): Additional configurations for reference values, client secrets, resource access policies, and attestation policies.

1.	Create the KbsConfig custom resource: Create the KbsConfig custom resource (CR) to launch Trustee and check the Trustee pods and pod logs to verify the configuration.

1.	Verify the attestation process: Create a test pod and retrieve its secret to verify the attestation process.

## Part 1: Deploy OpenShift sandboxed containers

> [!NOTE]
> In order to deploy sandboxed containers, you must have access to the cluster with the cluster-admin role.
> 

### Install the OpenShift sandboxed containers Operator

1. Create an `osc-namespace.yaml` manifest file:

    ```
    apiVersion: v1
    kind: Namespace
    metadata:
        name: openshift-sandboxed-containers-operator
    ```
    
1. Create the namespace by running the following command: 

    `$ oc apply -f osc-namespace.yaml`

1. Create an `osc-operatorgroup.yaml` manifest file:

    ```
    apiVersion: operators.coreos.com/v1
    kind: OperatorGroup
    metadata:
      name: sandboxed-containers-operator-group
      namespace: openshift-sandboxed-containers-operator
    spec:
      targetNamespaces:
      - openshift-sandboxed-containers-operator
    ```
    
1.	Create the operator group by running the following command

    `$ oc apply -f osc-operatorgroup.yaml`

1.	Create an `osc-subscription.yaml` manifest file:

    ```
    apiVersion: operators.coreos.com/v1alpha1
    kind: Subscription
    metadata:
      name: sandboxed-containers-operator
      namespace: openshift-sandboxed-containers-operator
    spec:
      channel: stable
      installPlanApproval: Automatic
      name: sandboxed-containers-operator
      source: redhat-operators
      sourceNamespace: openshift-marketplace
      startingCSV: sandboxed-containers-operator.v1.7.0
    ```
    
1.	Create the subscription by running the following command:

    `$ oc apply -f osc-subscription.yaml`

1.	Verify that the Operator is correctly installed by running the following command:

    `$ oc get csv -n openshift-sandboxed-containers-operator`

    > [!NOTE]
> This command can take several minutes to complete.

1.	Watch the process by running the following command:

    `$ watch oc get csv -n openshift-sandboxed-containers-operator`

    Example Output:
    ```
    NAME                             DISPLAY                                  VERSION    REPLACES     PHASE
    openshift-sandboxed-containers   openshift-sandboxed-containers-operator  1.7.0      1.6.0        Succeeded
    ```





### Create the peer pods secret

You must create the peer pods secret for OpenShift sandboxed containers. The secret stores credentials for creating the pod virtual machine (VM) image and peer pod instances.

By default, the OpenShift sandboxed containers Operator creates the secret based on the credentials used to create the cluster. However, you can manually create a secret that uses different credentials.


1.	Retrieve the Azure subscription ID by running the following command:

    ```
    $ AZURE_SUBSCRIPTION_ID=$(az account list --query "[?isDefault].id" \
      -o tsv) && echo "AZURE_SUBSCRIPTION_ID: \"$AZURE_SUBSCRIPTION_ID\""
    ```

1.	Generate the RBAC content by running the following command:

    ```
    $ az ad sp create-for-rbac --role Contributor --scopes /subscriptions/$AZURE_SUBSCRIPTION_ID \
      --query "{ client_id: appId, client_secret: password, tenant_id: tenant }"
    Example output
    {
      "client_id": `AZURE_CLIENT_ID`,
      "client_secret": `AZURE_CLIENT_SECRET`,
      "tenant_id": `AZURE_TENANT_ID`
    }
    ```

1.	Record the RBAC output to use in the secret object.

1.	Create a peer-pods-secret.yaml manifest file according to the following example:

    ```
    apiVersion: v1
    kind: Secret
    metadata:
      name: peer-pods-secret
      namespace: openshift-sandboxed-containers-operator
    type: Opaque
    stringData:
      AZURE_CLIENT_ID: "<azure_client_id>"
      AZURE_CLIENT_SECRET: "<azure_client_secret>"
      AZURE_TENANT_ID: "<azure_tenant_id>"
      AZURE_SUBSCRIPTION_ID: "<azure_subscription_id>"
    ```

    **Notes:**
    - Specify the `AZURE_CLIENT_ID value`.
    - Specify the `AZURE_CLIENT_SECRET value`.
    - Specify the `AZURE_TENANT_ID value`.
    - Specify the `AZURE_SUBSCRIPTION_ID value`.

1.	Create the secret by running the following command:

    `$ oc apply -f peer-pods-secret.yaml`




### Create the peer pods config map

1.	Obtain the following values from Azure:

    1. Retrieve and record the Azure resource group:
    
        `$ AZURE_RESOURCE_GROUP=$(oc get infrastructure/cluster -o jsonpath='{.status.platformStatus.azure.resourceGroupName}') && echo "AZURE_RESOURCE_GROUP: \"$AZURE_RESOURCE_GROUP\""`
        
    1. Retrieve and record the Azure VNet name:
    
        ```
        $ AZURE_VNET_NAME=$(az network vnet list --resource-group ${AZURE_RESOURCE_GROUP} --query "[].{Name:name}" --output tsv)
        ```
            
        This value is used to retrieve the Azure subnet ID.
        
    1. Retrieve and record the Azure subnet ID:
        
        ```
        $ AZURE_SUBNET_ID=$(az network vnet subnet list --resource-group ${AZURE_RESOURCE_GROUP} --vnet-name $AZURE_VNET_NAME --query "[].{Id:id} | [? contains(Id, 'worker')]" --output tsv) && echo "AZURE_SUBNET_ID: \"$AZURE_SUBNET_ID\""
        ```
            
    1. Retrieve and record the Azure network security group (NSG) ID:
    
        ```
        $ AZURE_NSG_ID=$(az network nsg list --resource-group ${AZURE_RESOURCE_GROUP} --query "[].{Id:id}" --output tsv) && echo "AZURE_NSG_ID: \"$AZURE_NSG_ID\""
        ```
            
    1. Retrieve and record the Azure region:
    
        `$ AZURE_REGION=$(az group show --resource-group ${AZURE_RESOURCE_GROUP} --query "{Location:location}" --output tsv) && echo "AZURE_REGION: \"$AZURE_REGION\""`
    
2.	Create a peer-pods-cm.yaml manifest file according to the following example:

    ```
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: peer-pods-cm
      namespace: openshift-sandboxed-containers-operator
    data:
      CLOUD_PROVIDER: "azure"
      VXLAN_PORT: "9000"
      AZURE_INSTANCE_SIZE: "Standard_B2als_v2"
      AZURE_INSTANCE_SIZES: "Standard_B2als_v2,Standard_D2as_v5,Standard_D4as_v5,Standard_D2ads_v5"
      AZURE_SUBNET_ID: "<azure_subnet_id>"
      AZURE_NSG_ID: "<azure_nsg_id>"
      PROXY_TIMEOUT: "5m"
      AZURE_IMAGE_ID: "<azure_image_id>"
      AZURE_REGION: "<azure_region>"
      AZURE_RESOURCE_GROUP: "<azure_resource_group>"
      DISABLECVM: "true"
    ```
    **Notes:**
    - `AZURE_INSTANCE_SIZE` is the default if an instance size is not defined in the workload.
    - `AZURE_INSTANCE_SIZES` lists all of the instance sizes you can specify when creating the pod. This allows you to define smaller instance sizes for workloads that need less memory and fewer CPUs or larger instance sizes for larger workloads.
    - Specify the `AZURE_SUBNET_ID` value that you retrieved.
    - Specify the `AZURE_NSG_ID` value that you retrieved.
    - `AZURE_IMAGE_ID` is optional. By default, this value is populated when you run the KataConfig CR, using an Azure image ID based on your cluster credentials. If you create your own Azure image, specify the correct image ID.
    - Specify the `AZURE_REGION` value you retrieved.
    - Specify the `AZURE_RESOURCE_GROUP` value you retrieved.
    
3.	Create the config map by running the following command:
    `$ oc apply -f peer-pods-cm.yaml`


### Create the Azure secret

You must create an SSH key secret, which Azure uses to create virtual machines.

1.	Generate an SSH key pair by running the following command:

    `$ ssh-keygen -f ./id_rsa -N ""`

1. Create the secret object by running the following command:
    
    ```
    $ oc create secret generic ssh-key-secret \
          -n openshift-sandboxed-containers-operator \
          --from-file=id_rsa.pub=./id_rsa.pub
    ```
    
1. Delete the SSH keys you created:

    `$ shred --remove id_rsa.pub id_rsa`


## Part 2: Deploy Confidential Containers


### Install the Trustee Operator

1. Create a trustee-namespace.yaml manifest file:

apiVersion: v1
kind: Namespace
metadata:
  name: trustee-operator-system

1.	Create the trustee-operator-system namespace by running the following command:

    `$ oc apply -f trustee-namespace.yaml`

1.	Create a trustee-operatorgroup.yaml manifest file:

    ```
    apiVersion: operators.coreos.com/v1
    kind: OperatorGroup
    metadata:
      name: trustee-operator-group
      namespace: trustee-operator-system
    spec:
      targetNamespaces:
      - trustee-operator-system
    ```

1.	Create the Operator group by running the following command:

    `$ oc apply -f trustee-operatorgroup.yaml`

1.	Create a trustee-subscription.yaml manifest file:

    ```
    apiVersion: operators.coreos.com/v1alpha1
    kind: Subscription
    metadata:
      name: trustee-operator
      namespace: trustee-operator-system
    spec:
      channel: stable
      installPlanApproval: Automatic
      name: trustee-operator
      source: redhat-operators
      sourceNamespace: openshift-marketplace
      startingCSV: trustee-operator.v0.1.0
    ```

1.	Create the subscription by running the following command:

    `$ oc apply -f trustee-subscription.yaml`

1.	Verify that the Operator is correctly installed by running the following command:

    `$ oc get csv -n trustee-operator-system`

    This command can take several minutes to complete.

1.	Watch the process by running the following command:

    `$ watch oc get csv -n trustee-operator-system`

    Example output:
    ```
    NAME                          DISPLAY                        PHASE
    trustee-operator.v0.1.0       Trustee Operator  0.1.0        Succeeded
    ```

### Create the route for the Trustee

Create a secure route with edge TLS termination for Trustee. External ingress traffic reaches the router pods as HTTPS and passes on to the Trustee pods as HTTP.

1.	Create an edge route by running the following command:

    
    ```
    $ oc create route edge --service=kbs-service --port kbs-port \
      -n trustee-operator-system
    ```
    
    > [!NOTE]
    > Currently, only a route with a valid CA-signed certificate is supported. You cannot use a route with self-signed certificate.
    > 

1.	Set the TRUSTEE_HOST variable by running the following command:

    ```
    $ TRUSTEE_HOST=$(oc get route -n trustee-operator-system kbs-service \
      -o jsonpath={.spec.host})
    ```

1.	Verify the route by running the following command:

    `$ echo $TRUSTEE_HOST`

    Example output:
    `kbs-service-trustee-operator-system.apps.memvjias.eastus.aroapp.io`
    
    Record this value for the peer pods config map.

### Enable the Confidential Containers feature gate

1.	Create a cc-feature-gate.yaml manifest file:

    ```azurecli
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: osc-feature-gates
      namespace: openshift-sandboxed-containers-operator
    data:
      confidential: "true"
    ```

1.	Create the config map by running the following command:

    `$ oc apply -f cc-feature-gate.yaml`



### Update the peer pods config map

1.	Obtain the following values from your Azure instance:

    i.	Retrieve and record the Azure resource group:
    
    `$ AZURE_RESOURCE_GROUP=$(oc get infrastructure/cluster -o jsonpath='{.status.platformStatus.azure.resourceGroupName}') && echo "AZURE_RESOURCE_GROUP: \"$AZURE_RESOURCE_GROUP\""`
    
    ii.	Retrieve and record the Azure VNet name:
    
    `$ AZURE_VNET_NAME=$(az network vnet list --resource-group ${AZURE_RESOURCE_GROUP} --query "[].{Name:name}" --output tsv)`
    
    This value is used to retrieve the Azure subnet ID.
    
    iii.	Retrieve and record the Azure subnet ID:
    
    `$ AZURE_SUBNET_ID=$(az network vnet subnet list --resource-group ${AZURE_RESOURCE_GROUP} --vnet-name $AZURE_VNET_NAME --query "[].{Id:id} | [? contains(Id, 'worker')]" --output tsv) && echo "AZURE_SUBNET_ID: \"$AZURE_SUBNET_ID\""`
    
    iv.	Retrieve and record the Azure network security group (NSG) ID:
    
    `$ AZURE_NSG_ID=$(az network nsg list --resource-group ${AZURE_RESOURCE_GROUP} --query "[].{Id:id}" --output tsv) && echo "AZURE_NSG_ID: \"$AZURE_NSG_ID\""`
    
    v.	Retrieve and record the Azure region:
    
    `$ AZURE_REGION=$(az group show --resource-group ${AZURE_RESOURCE_GROUP} --query "{Location:location}" --output tsv) && echo "AZURE_REGION: \"$AZURE_REGION\""`

1.	Create a `peer-pods-cm.yaml` manifest file according to the following example:

    ```
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: peer-pods-cm
      namespace: openshift-sandboxed-containers-operator
    data:
      CLOUD_PROVIDER: "azure"
      VXLAN_PORT: "9000"
      AZURE_INSTANCE_SIZE: "Standard_DC2as_v5"
      AZURE_INSTANCE_SIZES: "Standard_DC2as_v5,Standard_DC4as_v5,Standard_DC8as_v5,Standard_DC16as_v5"
      AZURE_SUBNET_ID: "<azure_subnet_id>"
      AZURE_NSG_ID: "<azure_nsg_id>"
      PROXY_TIMEOUT: "5m"
      AZURE_IMAGE_ID: "<azure_image_id>"
      AZURE_REGION: "<azure_region>"
      AZURE_RESOURCE_GROUP: "<azure_resource_group>"
      DISABLECVM: "false"
      AA_KBC_PARAMS: "cc_kbc::https://${TRUSTEE_HOST}"
    ```

    **Notes:**
    - `AZURE_INSTANCE_SIZE` is the default if an instance size is not defined in the workload.
    - `AZURE_INSTANCE_SIZES` lists all of the instance sizes you can specify when creating the pod. This allows you to define smaller instance sizes for workloads that need less memory and fewer CPUs or larger instance sizes for larger workloads.
    - Specify the `AZURE_SUBNET_ID` value that you retrieved.
    - Specify the `AZURE_NSG_ID` value that you retrieved.
    - `AZURE_IMAGE_ID` (Optional): By default, this value is populated when you run the KataConfig CR, using an Azure image ID based on your cluster credentials. If you create your own Azure image, specify the correct image ID.
    - Specify the `AZURE_REGION` value you retrieved.
    - Specify the `AZURE_RESOURCE_GROUP` value you retrieved.
    - `AA_KBC_PARAMS` specifies the host name of the Trustee route.

1.	Create the config map by running the following command:

    `$ oc apply -f peer-pods-cm.yaml`

1.	Restart the `peerpodconfig-ctrl-caa-daemon` daemon set by running the following command:

    ```
    $ oc set env ds/peerpodconfig-ctrl-caa-daemon \
      -n openshift-sandboxed-containers-operator REBOOT="$(date)"
    ```



### Create the KataConfig custom resource

1.	Create an `example-kataconfig.yaml` manifest file according to the following example:

    ```
    apiVersion: kataconfiguration.openshift.io/v1
        kind: KataConfig
        metadata:
          name: example-kataconfig
        spec:
          enablePeerPods: true
          logLevel: info
        #  kataConfigPoolSelector:
        #    matchLabels:
        #      <label_key>: '<label_value>'
    ```

    Optional: If you have applied node labels to install kata-remote on specific nodes, specify the key and value, for example, cc: 'true'.

1.	Create the KataConfig CR by running the following command:

    `$ oc apply -f example-kataconfig.yaml`
    
    The new KataConfig CR is created and installs kata-remote as a runtime class on the worker nodes.
    
    > [!NOTE]
    > Wait for the kata-remote installation to complete and the worker nodes to reboot before verifying the installation.
    > 

1.	Monitor the installation progress by running the following command:

    `$ watch "oc describe kataconfig | sed -n /^Status:/,/^Events/p"`
    
    When the status of all workers under kataNodes is installed and the condition InProgress is False without specifying a reason, the kata-remote is installed on the cluster.

1.	Verify the daemon set by running the following command:

    `$ oc get -n openshift-sandboxed-containers-operator ds/peerpodconfig-ctrl-caa-daemon`

1.	Verify the runtime classes by running the following command:

    $ oc get runtimeclass
    
    Example output:
    
    ```
    NAME             HANDLER         AGE
    kata-remote      kata-remote     152m
    ```

### Create the Trustee authentication secret

1.	Create a private key by running the following command:

    `$ openssl genpkey -algorithm ed25519 > privateKey`

1.	Create a public key by running the following command:

    `$ openssl pkey -in privateKey -pubout -out publicKey`

1.	Create a secret by running the following command:

    `$ oc create secret generic kbs-auth-public-key --from-file=publicKey -n trustee-operator-system`

1.	Verify the secret by running the following command:

    `$ oc get secret -n trustee-operator-system`


### Create the Trustee config map

1.	Create a kbs-config-cm.yaml manifest file:

    ```
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: kbs-config-cm
      namespace: trustee-operator-system
    data:
      kbs-config.json: |
        {
          "insecure_http" : true,
          "sockets": ["0.0.0.0:8080"],
          "auth_public_key": "/etc/auth-secret/publicKey",
          "attestation_token_config": {
            "attestation_token_type": "CoCo"
          },
          "repository_config": {
            "type": "LocalFs",
            "dir_path": "/opt/confidential-containers/kbs/repository"
          },
          "as_config": {
            "work_dir": "/opt/confidential-containers/attestation-service",
            "policy_engine": "opa",
            "attestation_token_broker": "Simple",
              "attestation_token_config": {
              "duration_min": 5
              },
            "rvps_config": {
              "store_type": "LocalJson",
              "store_config": {
                "file_path": "/opt/confidential-containers/rvps/reference-values/reference-values.json"
              }
             }
          },
          "policy_engine_config": {
            "policy_path": "/opt/confidential-containers/opa/policy.rego"
          }
        }
    ```
    
1.	Create the config map by running the following command:

    `$ oc apply -f kbs-config-cm.yaml`









