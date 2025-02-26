---
title: Deploy Confidential Containers in an Azure Red Hat OpenShift (ARO) cluster (Preview)
description: Discover how to deploy Confidential Containers in Azure Red Hat OpenShift (ARO)
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: confidential containers, aro, deploy, openshift, red hat
ms.topic: how-to
ms.date: 12/19/2024
ms.custom: template-how-to
---

# Deploy Confidential Containers in an Azure Red Hat OpenShift (ARO) cluster (Preview)

This article describes the steps required to deploy Confidential Containers for an ARO cluster. This process involves two main parts and multiple steps:

First, deploy OpenShift Sandboxed Containers, including the following steps:

1. Install the OpenShift Sandboxed Containers Operator.    
    
1. Create the peer pods secret.

1. Create the peer pods config map.

1. Create the Azure secret.

After deploying OpenShift Sandboxed Containers, deploy Confidential Containers. This involves the following steps:

1.	Install the Trustee Operator.

1.	Create the route for the Trustee. 

1.	Enable the Confidential Containers feature gate.

1.	Update the peer pods config map.

1.	Create the KataConfig custom resource. 

1.	Create the Trustee authentication secret.
    
1.	Create the Trustee config map. 

1.	Configure Trustee.

1.	Create the KbsConfig custom resource.

1.	Verify the attestation process.
    
## Before you begin

Before beginning the deployment process, make sure the following prerequisites are met:

- An existing ARO cluster (version 4.15 or later) with at least one worker node

- Access to the cluster with the `cluster-admin` role

- The [OpenShift CLI installed](howto-create-private-cluster-4x.md#install-the-openshift-cli)

> [!IMPORTANT]
> For each pod in an application, there is a one-to-one mapping with a corresponding Confidential Virtual Machine (CVM). This means that every new pod requires a separate CVM, ensuring isolation between pods.
> 

## Part 1: Deploy OpenShift sandboxed containers

### Install the OpenShift sandboxed containers Operator

The OpenShift sandboxed containers operator can be installed through the CLI or the OpenShift web console.

### [CLI](#tab/cli)

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

    **Example Output**
    ```
    NAME                             DISPLAY                                  VERSION    REPLACES     PHASE
    openshift-sandboxed-containers   openshift-sandboxed-containers-operator  1.7.0      1.6.0        Succeeded
    ```


### [Console](#tab/console)

1. In the web console, navigate to **Operators → OperatorHub**.

1. In the **Filter by keyword** field, type OpenShift sandboxed containers.

1. Select the **OpenShift sandboxed containers Operator** tile and select **Install**.

1. On the **Install Operator** page, select **stable** from the list of available **Update Channel** options.

1. Verify that **Operator recommended Namespace** is selected for **Installed Namespace**. This installs the Operator in the mandatory `openshift-sandboxed-containers-operator` namespace. If this namespace doesn't yet exist, it's automatically created.

    > [!NOTE]
    > Attempting to install the OpenShift sandboxed containers Operator in a namespace other than openshift-sandboxed-containers-operator causes the installation to fail.
    > 

1. Verify that **Automatic** is selected for **Approval Strategy**. **Automatic** is the default value, and enables automatic updates to OpenShift sandboxed containers when a new z-stream release is available.

1. Select **Install**.

1. Navigate to **Operators → Installed Operators** to verify that the Operator is installed.

---

### Create the peer pods secret

You must create the peer pods secret for OpenShift sandboxed containers. The secret stores credentials for creating the pod virtual machine (VM) image and peer pod instances.

By default, the OpenShift sandboxed containers operator creates the secret based on the credentials used to create the cluster. However, you can manually create a secret that uses different credentials.


1.	Retrieve the Azure subscription ID by running the following command:

    ```
    $ AZURE_SUBSCRIPTION_ID=$(az account list --query "[?isDefault].id" \
      -o tsv) && echo "AZURE_SUBSCRIPTION_ID: \"$AZURE_SUBSCRIPTION_ID\""
    ```

1.	Generate the role-based access control (RBAC) content by running the following command:
    
    ```
    $ az ad sp create-for-rbac --role Contributor --scopes /subscriptions/$AZURE_SUBSCRIPTION_ID \
          --query "{ client_id: appId, client_secret: password, tenant_id: tenant }"
    ```
        
    **Example output**        
    ```
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
    - `AZURE_INSTANCE_SIZE` is the default if an instance size isn't defined in the workload.
    - `AZURE_INSTANCE_SIZES` lists all of the instance sizes you can specify when creating the pod. This allows you to define smaller instance sizes for workloads that need less memory and fewer CPUs or larger instance sizes for larger workloads.
    - Specify the `AZURE_SUBNET_ID` value that you retrieved.
    - Specify the `AZURE_NSG_ID` value that you retrieved.
    - `AZURE_IMAGE_ID` is optional. By default, this value is populated when you run the KataConfig custom resource, using an Azure image ID based on your cluster credentials. If you create your own Azure image, specify the correct image ID.
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

    ```
    apiVersion: v1
    kind: Namespace
    metadata:
    name: trustee-operator-system
    ```


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

    **Example output**
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

    **Example output**
    `kbs-service-trustee-operator-system.apps.memvjias.eastus.aroapp.io`
    
    Record this value for the peer pods config map.

### Enable the Confidential Containers feature gate

1.	Create a `cc-feature-gate.yaml` manifest file:

    ```
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
      AZURE_INSTANCE_SIZES: "Standard_DC2as_v5,Standard_DC4as_v5,Standard_DC8as_v5"
      AZURE_SUBNET_ID: "<azure_subnet_id>"
      AZURE_NSG_ID: "<azure_nsg_id>"
      PROXY_TIMEOUT: "5m"
      AZURE_IMAGE_ID: "<azure_image_id>"
      AZURE_REGION: "<azure_region>"
      AZURE_RESOURCE_GROUP: "<azure_resource_group>"
      DISABLECVM: "false"
      AA_KBC_PARAMS: "cc_kbc::https://${TRUSTEE_HOST}"
    ```

    - `AZURE_INSTANCE_SIZE` is the default if an instance size isn't defined in the workload. **For TDX, specify "Standard_EC4eds_v5"**.
    - `AZURE_INSTANCE_SIZES` lists all of the instance sizes you can specify when creating the pod. This allows you to define smaller instance sizes for workloads that need less memory and fewer CPUs or larger instance sizes for larger workloads. **For TDX, specify "Standard_EC4eds_v5, Standard_EC8eds_v5, Standard_EC16eds_v5".**
    - Specify the `AZURE_SUBNET_ID` value that you retrieved.
    - Specify the `AZURE_NSG_ID` value that you retrieved.
    - `AZURE_IMAGE_ID` (Optional): By default, this value is populated when you run the KataConfig custom resource, using an Azure image ID based on your cluster credentials. If you create your own Azure image, specify the correct image ID.
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

1.	Create the KataConfig custom resource by running the following command:

    `$ oc apply -f example-kataconfig.yaml`
    
    The new KataConfig custom resource is created and installs kata-remote as a runtime class on the worker nodes.
    
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
    
    **Example output**    
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

1.	Create a `kbs-config-cm.yaml` manifest file:

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


### Configure Trustee

Configure the following Trustee settings:

**Configure reference values**

You can configure reference values for the Reference Value Provider Service (RVPS) by specifying the trusted digests of your hardware platform.

The client collects measurements from the running software, the Trusted Execution Environment (TEE) hardware and firmware and it submits a quote with the claims to the Attestation Server. These measurements must match the trusted digests registered to the Trustee. This process ensures that the confidential VM (CVM) is running the expected software stack and hasn't been tampered with.

1.	Create an `rvps-configmap.yaml` manifest file:

    ```
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: rvps-reference-values
      namespace: trustee-operator-system
    data:
      reference-values.json: |
        [ 
        ]
    ```
    
    For `reference-values.json` specify the trusted digests for your hardware platform if required. Otherwise, leave it empty.

1.	Create the RVPS config map by running the following command:

    `$ oc apply -f rvps-configmap.yaml`




<!--

**Secret with custom keys for clients** (Optional)

You can create a secret that contains one or more custom keys for Trustee clients.

**Resource access policy** (Optional)

You must configure a policy for the Trustee policy engine to determine which resources to access.

Don't confuse the Trustee policy engine with the Attestation Service policy engine, which determines the validity of TEE evidence.

-->

**Create your own attestation policy**

You can overwrite the default attestation policy by creating your own attestation policy.

1.	Create an attestation-policy.yaml manifest file according to the following example:
    
    ```
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: attestation-policy
      namespace: trustee-operator-system
    data:
      default.rego: |
         package policy
         import future.keywords.every
    
         default allow = false
    
         allow {
            every k, v in input {
                judge_field(k, v)
            }
         }
    
         judge_field(input_key, input_value) {
            has_key(data.reference, input_key)
            reference_value := data.reference[input_key]
            match_value(reference_value, input_value)
         }
    
         judge_field(input_key, input_value) {
            not has_key(data.reference, input_key)
         }
    
         match_value(reference_value, input_value) {
            not is_array(reference_value)
            input_value == reference_value
         }
    
         match_value(reference_value, input_value) {
            is_array(reference_value)
            array_include(reference_value, input_value)
         }
    
         array_include(reference_value_array, input_value) {
            reference_value_array == []
         }
    
         array_include(reference_value_array, input_value) {
            reference_value_array != []
            some i
            reference_value_array[i] == input_value
         }
    
         has_key(m, k) {
            _ = m[k]
         }
    ```

    For the `package policy`, the attestation policy follows the Open Policy Agent specification. In this example, the attestation policy compares the claims provided in the attestation report to the reference values registered in the RVPS database. The attestation process is successful only if all the values match.

1.	Create the attestation policy config map by running the following command:

    `$ oc apply -f attestation-policy.yaml`


**Provisioning Certificate Caching Service for TDX**

If your TEE is Intel Trust Domain Extensions (TDX), you must configure the Provisioning Certificate Caching Service (PCCS). The PCCS retrieves Provisioning Certification Key (PCK) certificates and caches them in a local database.

1.	Create a tdx-config.yaml manifest file:

    ```
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: tdx-config
      namespace: trustee-operator-system
    data:
      sgx_default_qcnl.conf: | \
          {
            "collateral_service": "https://api.trustedservices.intel.com/sgx/certification/v4/",
            "pccs_url": "<pccs_url>"
          }
    ```

    For `pccs_url`, specify the PCCS URL, for example, https://localhost:8081/sgx/certification/v4/.

1.	Create the TDX config map by running the following command:

    `$ oc apply -f tdx-config.yaml`



<!--


1.	Create an `rvps-configmap.yaml` manifest file:

    ```
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: rvps-reference-values
      namespace: trustee-operator-system
    data:
      reference-values.json: |
        [ 
        ]
    ```
    
    For `reference-values.json` specify the trusted digests for your hardware platform if required. Otherwise, leave it empty.

1.	Create the RVPS config map by running the following command:

    `$ oc apply -f rvps-configmap.yaml`

1.	Create one or more secrets to share with attested clients according to the following example:

    ```
    $ oc create secret generic kbsres1 --from-literal key1=<res1val1> \
      --from-literal key2=<res1val2> -n trustee-operator-system
    ```

    In this example, the `kbsres1` secret has two entries (key1, key2), which the Trustee clients retrieve. You can add more secrets according to your requirements.

1.	Create a resourcepolicy-configmap.yaml manifest file:

    ```
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: resource-policy
      namespace: trustee-operator-system
    data:
      policy.rego:
        package policy
        default allow = false
        allow {
          input["tee"] != "sample"
        }
    ```

    - The name of the resource policy, `policy.rego`, must match the resource policy defined in the Trustee config map.
    - The resource package policy follows the Open Policy Agent specification. This example allows the retrieval of all resources when the TEE isn't the sample attester.

1.	Create the resource policy config map by running the following command:

    `$ oc apply -f resourcepolicy-configmap.yaml`

1.	Create an attestation-policy.yaml manifest file according to the following example:
    
    ```
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: attestation-policy
      namespace: trustee-operator-system
    data:
      default.rego: |
         package policy
         import future.keywords.every
    
         default allow = false
    
         allow {
            every k, v in input {
                judge_field(k, v)
            }
         }
    
         judge_field(input_key, input_value) {
            has_key(data.reference, input_key)
            reference_value := data.reference[input_key]
            match_value(reference_value, input_value)
         }
    
         judge_field(input_key, input_value) {
            not has_key(data.reference, input_key)
         }
    
         match_value(reference_value, input_value) {
            not is_array(reference_value)
            input_value == reference_value
         }
    
         match_value(reference_value, input_value) {
            is_array(reference_value)
            array_include(reference_value, input_value)
         }
    
         array_include(reference_value_array, input_value) {
            reference_value_array == []
         }
    
         array_include(reference_value_array, input_value) {
            reference_value_array != []
            some i
            reference_value_array[i] == input_value
         }
    
         has_key(m, k) {
            _ = m[k]
         }
    ```

    For `package policy`, The attestation policy follows the Open Policy Agent specification. In this example, the attestation policy compares the claims provided in the attestation report to the reference values registered in the RVPS database. The attestation process is successful only if all the values match.

1.	Create the attestation policy config map by running the following command:

    `$ oc apply -f attestation-policy.yaml`

1.	If your TEE is Intel TDX, create a tdx-config.yaml manifest file:

    ```
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: tdx-config
      namespace: trustee-operator-system
    data:
      sgx_default_qcnl.conf: | \
          {
            "collateral_service": "https://api.trustedservices.intel.com/sgx/certification/v4/",
            "pccs_url": "<pccs_url>"
          }
    ```

    For `pccs_url`, specify the PCCS URL, for example, https://localhost:8081/sgx/certification/v4/.

1.	Create the TDX config map by running the following command:

    `$ oc apply -f tdx-config.yaml`

-->

**Create a secret for container image signature verification**

If you use container image signature verification, you must create a secret that contains the public container image signing key. The Trustee Operator uses the secret to verify the signature, ensuring that only trusted and authenticated container images are deployed in your environment.

1. Create a secret for container image signature verification by running the following command:

    ```
    $ oc apply secret generic <type> \
        --from-file=<tag>=./<public_key_file> \
        -n trustee-operator-system
     ```
    
    - Specify the KBS secret type, for example, `img-sig`.
    - Specify the secret tag, for example, `pub-key`, and the public container image signing key.
    
1. Record the `<type>` value. You must add this value to the spec.kbsSecretResources key when you create the KbsConfig custom resource.

**Create the container image signature verification policy**

You must create the container image signature verification policy because signature verification is always enabled. 

> [!IMPORTANT]
> If this policy is missing, the pods will not start. If you are not using container image signature verification, you create the policy without signature verification.
> 
1. Create a security-policy-config.json file according to the following examples:

    Without signature verification:
    
    ```
    {
            "default": [
            {
            "type": "insecureAcceptAnything"
            }],
            "transports": {}
        }
    ```
        
    With signature verification:
    
    ```
    {
            "default": [
            {
            "type": "insecureAcceptAnything"
            ],
            "transports": {
            "<transport>": {
            "<registry>/<image>":
            [
            {
            "type": "sigstoreSigned",
            "keyPath": "kbs:///default/<type>/<tag>"
            }
            ]
            }
            }
        }
    ```
        
    - Specify the image repository for transport, for example, "docker".
    - Specify the container registry and image, for example, "quay.io/my-image".
    - Specify the type and tag of the container image signature verification secret that you created, for example, "img-sig/pub-key".
    
1. Create the security policy by running the following command:

    ```
    $ oc apply secret generic security-policy \
        --from-file=osc=./<security-policy-config.json> \
        -n trustee-operator-system
    ```
    
    Do not alter the secret type, security-policy, or the key, osc.
    
    The security-policy secret is specified in the `spec.kbsSecretResources` key of the KbsConfig custom resource.
    

### Create the KbsConfig custom resource

You must create the KbsConfig custom resource to launch Trustee.

1.	Create a `kbsconfig-cr.yaml` manifest file:

    ```
    apiVersion: confidentialcontainers.org/v1alpha1
    kind: KbsConfig
    metadata:
      labels:
        app.kubernetes.io/name: kbsconfig
        app.kubernetes.io/instance: kbsconfig
        app.kubernetes.io/part-of: trustee-operator
        app.kubernetes.io/managed-by: kustomize
        app.kubernetes.io/created-by: trustee-operator
      name: kbsconfig
      namespace: trustee-operator-system
    spec:
      kbsConfigMapName: kbs-config-cm
      kbsAuthSecretName: kbs-auth-public-key
      kbsDeploymentType: AllInOneDeployment
      kbsRvpsRefValuesConfigMapName: rvps-reference-values
      kbsSecretResources: ["kbsres1", "security-policy", "<type>"]
      kbsResourcePolicyConfigMapName: resource-policy
        # tdxConfigSpec:
        #   kbsTdxConfigMapName: tdx-config
        #   kbsAttestationPolicyConfigMapName: attestation-policy
        #   kbsServiceType: <service_type>
    ```
    - Optional: Specify the `type` value of the container image signature verification secret if you created the secret, for example, `img-sig`. If you didn't create the secret, set the `kbsSecretResources` value to `["kbsres1", "security-policy"]`.
    - Uncomment `tdxConfigSpec.kbsTdxConfigMapName: tdx-config` for Intel Trust Domain Extensions. 
    - Uncomment `kbsAttestationPolicyConfigMapName: attestation-policy` if you create a customized attestation policy. 
    - Uncomment `kbsServiceType: <service_type>` if you create a service type, other than the default ClusterIP service, to expose applications within the cluster external traffic. You can specify `NodePort`, `LoadBalancer`, or `ExternalName`. 

1.	Create the KbsConfig custom resource by running the following command:

    `$ oc apply -f kbsconfig-cr.yaml`

#### Verify the Trustee configuration

Verify the Trustee configuration by checking the Trustee pods and logs.

1.	Set the default project by running the following command:

    `$ oc project trustee-operator-system`

1.	Check the pods by running the following command:

    `$ oc get pods -n trustee-operator-system`

    **Example output**    
    ```
    NAME                                                   READY   STATUS    RESTARTS   AGE
    trustee-deployment-8585f98449-9bbgl                    1/1     Running   0          22m
    trustee-operator-controller-manager-5fbd44cd97-55dlh   2/2     Running   0          59m
    ```
    
1.	Set the POD_NAME environmental variable by running the following command:

    `$ POD_NAME=$(oc get pods -l app=kbs -o jsonpath='{.items[0].metadata.name}' -n trustee-operator-system)`

1.	Check the pod logs by running the following command:

    `$ oc logs -n trustee-operator-system $POD_NAME`

    **Example output**    
    ```
    [2024-05-30T13:44:24Z INFO  kbs] Using config file /etc/kbs-config/kbs-config.json
        [2024-05-30T13:44:24Z WARN  attestation_service::rvps] No RVPS address provided and will launch a built-in rvps
        [2024-05-30T13:44:24Z INFO  attestation_service::token::simple] No Token Signer key in config file, create an ephemeral key and without CA pubkey cert
        [2024-05-30T13:44:24Z INFO  api_server] Starting HTTPS server at [0.0.0.0:8080]
        [2024-05-30T13:44:24Z INFO  actix_server::builder] starting 12 workers
        [2024-05-30T13:44:24Z INFO  actix_server::server] Tokio runtime found; starting in existing Tokio runtime
    ```
        

### Verify the attestation process

You can verify the attestation process by creating a test pod and retrieving its secret.

Important: This procedure is an example to verify that attestation is working. Don't write sensitive data to standard I/O because the data can be captured by using a memory dump. Only data written to memory is encrypted.

By default, an agent side policy embedded in the pod VM image disables the exec and log APIs for a Confidential Containers pod. This policy ensures that sensitive data isn't written to standard I/O.

In a test scenario, you can override the restriction at runtime by adding a policy annotation to the pod. For Technology Preview, runtime policy annotations aren't verified by remote attestation.

1.	Create a verification-pod.yaml manifest file:

    ```
    apiVersion: v1
    kind: Pod
    metadata:
      name: ocp-cc-pod
      labels:
        app: ocp-cc-pod
      annotations:
        io.katacontainers.config.agent.policy: cGFja2FnZSBhZ2VudF9wb2xpY3kKCmRlZmF1bHQgQWRkQVJQTmVpZ2hib3JzUmVxdWVzdCA6PSB0cnVlCmRlZmF1bHQgQWRkU3dhcFJlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IENsb3NlU3RkaW5SZXF1ZXN0IDo9IHRydWUKZGVmYXVsdCBDb3B5RmlsZVJlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IENyZWF0ZUNvbnRhaW5lclJlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IENyZWF0ZVNhbmRib3hSZXF1ZXN0IDo9IHRydWUKZGVmYXVsdCBEZXN0cm95U2FuZGJveFJlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IEV4ZWNQcm9jZXNzUmVxdWVzdCA6PSB0cnVlCmRlZmF1bHQgR2V0TWV0cmljc1JlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IEdldE9PTUV2ZW50UmVxdWVzdCA6PSB0cnVlCmRlZmF1bHQgR3Vlc3REZXRhaWxzUmVxdWVzdCA6PSB0cnVlCmRlZmF1bHQgTGlzdEludGVyZmFjZXNSZXF1ZXN0IDo9IHRydWUKZGVmYXVsdCBMaXN0Um91dGVzUmVxdWVzdCA6PSB0cnVlCmRlZmF1bHQgTWVtSG90cGx1Z0J5UHJvYmVSZXF1ZXN0IDo9IHRydWUKZGVmYXVsdCBPbmxpbmVDUFVNZW1SZXF1ZXN0IDo9IHRydWUKZGVmYXVsdCBQYXVzZUNvbnRhaW5lclJlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IFB1bGxJbWFnZVJlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IFJlYWRTdHJlYW1SZXF1ZXN0IDo9IHRydWUKZGVmYXVsdCBSZW1vdmVDb250YWluZXJSZXF1ZXN0IDo9IHRydWUKZGVmYXVsdCBSZW1vdmVTdGFsZVZpcnRpb2ZzU2hhcmVNb3VudHNSZXF1ZXN0IDo9IHRydWUKZGVmYXVsdCBSZXNlZWRSYW5kb21EZXZSZXF1ZXN0IDo9IHRydWUKZGVmYXVsdCBSZXN1bWVDb250YWluZXJSZXF1ZXN0IDo9IHRydWUKZGVmYXVsdCBTZXRHdWVzdERhdGVUaW1lUmVxdWVzdCA6PSB0cnVlCmRlZmF1bHQgU2V0UG9saWN5UmVxdWVzdCA6PSB0cnVlCmRlZmF1bHQgU2lnbmFsUHJvY2Vzc1JlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IFN0YXJ0Q29udGFpbmVyUmVxdWVzdCA6PSB0cnVlCmRlZmF1bHQgU3RhcnRUcmFjaW5nUmVxdWVzdCA6PSB0cnVlCmRlZmF1bHQgU3RhdHNDb250YWluZXJSZXF1ZXN0IDo9IHRydWUKZGVmYXVsdCBTdG9wVHJhY2luZ1JlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IFR0eVdpblJlc2l6ZVJlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IFVwZGF0ZUNvbnRhaW5lclJlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IFVwZGF0ZUVwaGVtZXJhbE1vdW50c1JlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IFVwZGF0ZUludGVyZmFjZVJlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IFVwZGF0ZVJvdXRlc1JlcXVlc3QgOj0gdHJ1ZQpkZWZhdWx0IFdhaXRQcm9jZXNzUmVxdWVzdCA6PSB0cnVlCmRlZmF1bHQgV3JpdGVTdHJlYW1SZXF1ZXN0IDo9IHRydWUK
    spec:
      runtimeClassName: kata-remote
      containers:
        - name: skr-openshift
          image: registry.access.redhat.com/ubi9/ubi:9.3
          command:
            - sleep
            - "36000"
          securityContext:
            privileged: false
            seccompProfile:
              type: RuntimeDefault
    ```
   
   
    The pod metada `annotations` overrides the policy that prevents sensitive data from being written to standard I/O.
    
1.	Create the pod by running the following command:

    `$ oc create -f verification-pod.yaml`

1.	Connect to the Bash shell of the ocp-cc-pod pod by running the following command:

    `$ oc exec -it ocp-cc-pod -- bash`

1.	Fetch the pod secret by running the following command:

    `$ curl http://127.0.0.1:8006/cdh/resource/default/kbsres1/key1`
    
    **Example output**    
    `res1val1`
    
    The Trustee server returns the secret only if the attestation is successful.




