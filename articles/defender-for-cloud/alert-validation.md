---
title: Alert validation
description: Learn how to validate that your security alerts are correctly configured in Microsoft Defender for Cloud
ms.topic: how-to
ms.date: 06/27/2023
ms.author: dacurwin
author: dcurwin
---
# Alert validation in Microsoft Defender for Cloud

This document helps you learn how to verify if your system is properly configured for Microsoft Defender for Cloud alerts.

## What are security alerts?

Alerts are the notifications that Defender for Cloud generates when it detects threats on your resources. It prioritizes and lists the alerts along with the information needed to quickly investigate the problem. Defender for Cloud also provides recommendations for how you can remediate an attack.

For more information, see [Security alerts in Defender for Cloud](alerts-overview.md) and [Managing and responding to security alerts](managing-and-responding-alerts.md).

## Prerequisites

To receive all the alerts, your machines and the connected Log Analytics workspaces need to be in the same tenant.

## Generate sample security alerts

If you're using the new preview alerts experience as described in [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.md), you can create sample alerts from the security alerts page in the Azure portal.

Use sample alerts to:

- evaluate the value and capabilities of your Microsoft Defender plans.
- validate any configurations you've made for your security alerts (such as SIEM integrations,  workflow automation, and email notifications).

To create sample alerts:

1. As a user with the role **Subscription Contributor**, from the toolbar on the security alerts page, select **Sample alerts**.
1. Select the subscription.
1. Select the relevant Microsoft Defender plan/s for which you want to see alerts.
1. Select **Create sample alerts**.

    :::image type="content" source="media/alert-validation/create-sample-alerts-procedures.png" alt-text="Screenshot showing steps to create sample alerts in Microsoft Defender for Cloud." lightbox="media/alert-validation/create-sample-alerts-procedures.png":::

    A notification appears letting you know that the sample alerts are being created:

    :::image type="content" source="media/alert-validation/notification-sample-alerts-creation.png" alt-text="Screenshot showing notification that the sample alerts are being generated." lightbox="media/alert-validation/notification-sample-alerts-creation.png":::

    After a few minutes, the alerts appear in the security alerts page. They also appear anywhere else that you've configured to receive your Microsoft Defender for Cloud security alerts (connected SIEMs, email notifications, and so on).

    :::image type="content" source="media/alert-validation/sample-alerts.png" alt-text="Screenshot showing sample alerts in the security alerts list." lightbox="media/alert-validation/sample-alerts.png":::

    > [!TIP]
    > The alerts are for simulated resources.

## Simulate alerts on your Azure VMs (Windows) <a name="validate-windows"></a>

After the Microsoft Defender for Endpoint agent is installed on your machine, as part of Defender for Servers integration, follow these steps from the machine where you want to be the attacked resource of the alert:

1. Open an elevated command-line prompt on the device and run the script:

    1. Go to **Start** and type `cmd`.

    1. Right-select **Command Prompt** and select **Run as administrator**

    :::image type="content" source="media/alert-validation/command-prompt.png" alt-text="Screenshot showing where to select Run as Administrator." lightbox="media/alert-validation/command-prompt.png":::

1. At the prompt, copy and run the following command: `powershell.exe -NoExit -ExecutionPolicy Bypass -WindowStyle Hidden $ErrorActionPreference = 'silentlycontinue';(New-Object System.Net.WebClient).DownloadFile('http://127.0.0.1/1.exe', 'C:\\test-MDATP-test\\invoice.exe');Start-Process 'C:\\test-MDATP-test\\invoice.exe'`

1. The Command Prompt window closes automatically. If successful, a new alert should appear in Defender for Cloud Alerts blade in 10 minutes.

1. The message line in the PowerShell box should appear similar to how it's presented here:

    :::image type="content" source="media/alert-validation/powershell-no-exit.png" alt-text="Screenshot showing PowerShell message line." lightbox="media/alert-validation/powershell-no-exit.png":::

Alternately, you can also use the [EICAR](https://www.eicar.org/download/eicar.com.txt) test string to perform this test:  Create a text file, paste the EICAR line, and save the file as an executable file to your machine's local drive.  

> [!NOTE]
> When reviewing test alerts for Windows, make sure that you have Defender for Endpoint running with Real-Time protection enabled. Learn how to [validate this configuration](/microsoft-365/security/defender-endpoint/configure-real-time-protection-microsoft-defender-antivirus).

## Simulate alerts on your Azure VMs (Linux) <a name="validate-linux"></a>

After the Microsoft Defender for Endpoint agent is installed on your machine, as part of Defender for Servers integration, follow these steps from the machine where you want to be the attacked resource of the alert:

1. Open a Terminal window, copy and run the following command:
[`curl -o ~/Downloads/eicar.com.txt`](https://www.eicar.org/download/eicar.com.txt).
1. The Command Prompt window closes automatically. If successful, a new alert should appear in Defender for Cloud Alerts blade in 10 minutes.

> [!NOTE]
> When reviewing test alerts for Linux, make sure that you have Defender for Endpoint running with Real-Time protection enabled. Learn how to [validate this configuration](/microsoft-365/security/defender-endpoint/configure-real-time-protection-microsoft-defender-antivirus).

## Simulate alerts on Kubernetes <a name="validate-kubernetes"></a>

Defender for Containers provides security alerts for both your clusters and underlying cluster nodes. Defender for Containers accomplishes this by monitoring both the control plane (API server) and the containerized workload.

You can tell if your alert is related to the control plan or the containerized workload based on its prefix. Control plane security alerts have a prefix of `K8S_`, while security alerts for runtime workload in the clusters have a prefix of `K8S.NODE_`.

You can simulate alerts for both of the control plane, and workload alerts with the following steps.

### Simulate control plane alerts (K8S_ prefix)

**Prerequisites**

- Ensure the Defender for Containers plan is enabled.
- **Arc only** - Ensure the Defender extension is installed.
- **EKS or GKE only** - Ensure the default audit log collection autoprovisioning options are enabled.

**To simulate a Kubernetes control plane security alert**:

1. Run the following command from the cluster:

    ```bash
    kubectl get pods --namespace=asc-alerttest-662jfi039n
    ```

    You get the following response: `No resource found`.

1. Wait 30 minutes.

1. In the Azure portal, navigate to the Defender for Cloud's security alerts page.

1. On the relevant Kubernetes cluster, locate the following alert `Microsoft Defender for Cloud test alert for K8S (not a threat)`

### Simulate workload alerts (K8S.NODE_ prefix)

**Prerequisites**

- Ensure the Defender for Containers plan is enabled.
- Ensure the Defender profile\extension is installed.

**To simulate a a Kubernetes workload security alert**:

1. Create a pod to run a test command on. This pod can be any of the existing pods in the cluster, or a new pod. You can create using this sample yaml configuration:

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
        name: mdc-test
    spec:
        containers:
            - name: mdc-test
              image: ubuntu:18.04
              command: ["/bin/sh"]
              args: ["-c", "while true; do echo sleeping; sleep 3600;done"]
    ```

    To create the pod run:

    ```bash
    kubectl apply -f <path_to_the_yaml_file>
    ```

1. Run the following command from the cluster:

    ```bash
    kubectl exec -it mdc-test -- bash
    ```

1. Copy the executable to a separate location and rename it to `./asc_alerttest_662jfi039n` with the following command `cp /bin/echo ./asc_alerttest_662jfi039n`.

1. Execute the file `./asc_alerttest_662jfi039n testing eicar pipe`.

1. Wait 10 minutes.

1. In the Azure portal, navigate to the Defender for Cloud's security alerts page.

1. On the relevant AKS cluster, locate the following alert `Microsoft Defender for Cloud test alert (not a threat)`.

You can also learn more about defending your Kubernetes nodes and clusters with [Microsoft Defender for Containers](defender-for-containers-introduction.md).

## Simulate alerts for App Service

You can simulate alerts for resources running on [App Service](/azure/app-service/overview).

1. Create a new website and wait 24 hours for it to be registered with Defender for Cloud, or use an existing web site.

1. Once the web site is created, access it using the following URL:
      1. Open the app service resource pane and copy the domain for the URL from the default domain field.

          :::image type="content" source="media/alert-validation/copy-default-domain.png" alt-text="Screenshot showing where to copy the default domain." lightbox="media/alert-validation/copy-default-domain.png":::

      1. Copy the website name into the URL: `https://<website name>.azurewebsites.net/This_Will_Generate_ASC_Alert`.
1. An alert is generated within about 1-2 hours.

## Simulate alerts for Storage ATP (Advanced Threat Protection)

1. Navigate to a storage account that has Azure Defender for Storage enabled.
1. Select the **Containers** tab in the sidebar.

    :::image type="content" source="media/alert-validation/storage-atp-navigate-container.png" alt-text="Screenshot showing where to navigate to select a container." lightbox="media/alert-validation/storage-atp-navigate-container.png":::

1. Navigate to an existing container or create a new one.
1. Upload a file to that container. Avoid uploading any file that may contain sensitive data.

    :::image type="content" source="media/alert-validation/storage-atp-upload-image.png" alt-text="Screenshot showing where to upload a file to the container." lightbox="media/alert-validation/storage-atp-upload-image.png":::

1. Right-select the uploaded file and select **Generate SAS**.
1. Select the Generate SAS token and URL button (no need to change any options).
1. Copy the generated SAS URL.
1. Open the Tor browser, which you can [download here](https://www.torproject.org/download/).
1. In the Tor browser, navigate to the SAS URL.  You should now see and can download the file that was uploaded.

## Testing AppServices alerts

**To simulate an app services EICAR alert:**

1. Find the HTTP endpoint of the website either by going into Azure portal blade for the App Services website or using the custom DNS entry associated with this website. (The default URL endpoint for Azure App Services website has the suffix `https://XXXXXXX.azurewebsites.net`). The website should be an existing website and not one that was created prior to the alert simulation.
1. Browse to the website URL and add the following fixed suffix: `/This_Will_Generate_ASC_Alert`. The URL should look like this: `https://XXXXXXX.azurewebsites.net/This_Will_Generate_ASC_Alert`. It might take some time for the alert to be generated (~1.5 hours).

## Validate Azure Key Vault Threat Detection

1. If you don’t have a Key Vault created yet, make sure to [create one](/azure/key-vault/general/quick-create-portal).
1. After finishing creating the Key Vault and the secret, go to a VM that has Internet access and [download the TOR Browser](https://www.torproject.org/download/).
1. Install the TOR Browser on your VM.
1. Once you finished the installation, open your regular browser, sign-in to the Azure portal, and access the Key Vault page. Select the highlighted URL and copy the address.
1. Open TOR and paste this URL (you need to authenticate again to access the Azure portal).
1. After finishing access, you can also select the Secrets option in the left pane.
1. In the TOR Browser, sign out from Azure portal and close the browser.
1. After some time, Defender for Key Vault will trigger an alert with detailed information about this suspicious activity.

## Next steps

This article introduced you to the alerts validation process. Now that you're familiar with this validation, explore the following articles:

- [Validating Azure Key Vault threat detection in Microsoft Defender for Cloud](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/validating-azure-key-vault-threat-detection-in-microsoft/ba-p/1220336)
- [Managing and responding to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.md) - Learn how to manage alerts, and respond to security incidents in Defender for Cloud.
- [Understanding security alerts in Microsoft Defender for Cloud](./alerts-overview.md)
