---
title: Set-ToolsRepo Run Command in Azure VMware Solution
description: Use Set-ToolsRepo Run Commands in Azure VMware Solution
ms.topic: how-to
ms.service: azure-vmware
ms.custom: engagement-fy26
ms.date: 3/17/2026
# Customer intent: As a cloud administrator, I want to execute Set-ToolsRepo Run Commands in an Azure VMware Solution, so that I can utilize a specific VMware Tools version.
---

# Set-ToolsRepo Run Command
In this article, learn how to use the Set-ToolsRepo Run Command from end-to-end, how to download and host the correct GuestStore version of the VMware Tools zip file, how we run the AVS Run Command, and how you can validate success.

## When to use Set-ToolsRepo Run Command
This Run Command should be used to make a specific VMware Tolls version available for VM guest tools installation and upgrades in an Azure VMware Solution private cloud. When you want to centrally publish the GuestStore version of the VMware tools ZIP file to the vSAN central Tools location so that all relevant hosts can reference the package. 

## Prerequisutes 
  - A publicly accessible HTTP/HTTPS URL that points to the GuestStore version of the VMware Tools zip file (provided by the customer). The URL must be reachable from the Azure VMware Solution Run Command execution environment.
  - Permission to execute Azure VMware Solution Run Command packages in the Azure portal for the target private cloud.
  - The ZIP contents must include a VMware Tools payload directory in the expected layout.

### Expected ZIP Content
The ZIP file you upload must contain the versioned folder under the following section: **vmware/apps/vmtools/windows64/vmtools-\<version>/**.
The folder name must follow the format **vmtools-\<version>** (For example, **vmtools-12.4.0**).

## Tools ZIP URL
The Set-ToolsRepo Run command accepts a publicly accessible HTTP/HTTPS URL to the GuestStore version of the VMware Tools zip file that will be published to the vSAN central Tools location. 
Before making any changes, validation that the URL is usable and the ZIP file can be downloaded successfully occurs. 

  - The URL uses HTTP or HTTPS and is a direct download link.
  - The file is reachable without interactive authentication and can be downloaded end to end.

## End to end workflow
1. Customer downloads the required VMware Tools version.
    - The customer obtains the GuestStore version of the VMware Tools ZIP file for the specific version they want to publish to the vSAN central Tools location.
2. Customer hosts the ZIP file at a publicly accessible HTTP/HTTPS location.
    - The customer must host the ZIP at a publicly accessible HTTP/HTTPS URL (for example, any web server or object storage that can serve the file without interactive authentication). They then provide that direct-download URL for use with the Run Command.
>[!IMPORTANT]
> The URL must be a direct download link and reachable without interactive authentication so the Run Command can retrieve the ZIP file. 

3. Customer runs the Set-ToolsRepo Run Command.
    - Run the AVS Run Command and provide the ZIP URL shared in step 2. When it completes, the command output will indicate success or provide an error message.
4. VMware Tools packaged is published.
    - Once the Run Command completes successfully, the requested VMware Tools version is available from vSAN central Tools location for the private cloud.
5. Hosts are configured to use the vSAN repository
    - As part of the Run Command, the relavant ESXi hosts in the private cloud are updated to use vSAN central Tools location as the VMware Tools source.

## Validation
After successful run of the Set-ToolsRepo Run Command, be sure to follow the below steps for validation. 
  - Navigate to your vCenter client and browse the vSAN datastore. confirm the version folder exists under **GuestStore/vmware/apps/vmtools/windows64/**
  - Confirm the correct VMware Tools version is available to install or upgrade from within a guest test VM.
  - If any issues occur with the VMware Tools after a successful Run Command operation, capture the Run Command output and open a support request.

## Troubleshooting 
If the Run Command fails, the most common customer-side causes are the URL is not publicly reachable as a direct download link, or the ZIP does not contain the expected folder structure.  
Use the error message along with the troubleshooting steps listed below. 

### URL or Download issues 
  - **URL not reachable or the download fails**. Confirm the URL opens from an external network, is a direct-download link, and does not require sign-in, MFA, or time-limited tokens.
  - **TLS/SSL error**. Ensure the HTTPS endpoint supports modern TLS and presents a valid certificate.

### ZIP Structure issues
  - **Expected folder not found**. Ensure the ZIP contains vmware/apps/vmtools/windows64/vmtools-\<version> (including the leading vmware/ directory).
  - **Multiple versions in one ZIP**. Host a ZIP that contains only the single version you intend to publish, with one vmtools-\<version> folder.

### Datastore issues
  - **Service-side publish/configure error**. If the URL and ZIP structure are correct but the command still fails, capture the full Run Command output and open a support request.
  - **Intermittent failures**. Retry the Run Command after confirming the ZIP URL is still valid and reachable.

 ## Next step
To learn more about Run Commands, see [Run Commands](using-run-command.md).
