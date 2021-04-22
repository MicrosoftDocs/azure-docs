---
title: Set up GitHub Enterprise Server on your Azure VMware Solution private cloud
description: Learn how to Set up GitHub Enterprise Server on your Azure VMware Solution private cloud.
ms.topic: how-to
ms.date: 02/11/2021
---

# Set up GitHub Enterprise Server on your Azure VMware Solution private cloud

In this article, we walk through the steps to set up GitHub Enterprise Server, the "on-premises" version of [GitHub.com](https://github.com/), on your Azure VMware Solution private cloud. The scenario we'll cover is a GitHub Enterprise Server instance that can serve up to 3,000 developers running up to 25 jobs per minute on GitHub Actions. It includes the setup of (at time of writing) *preview* features, such as GitHub Actions. To customize the setup for your particular needs, review the requirements listed in [Installing GitHub Enterprise Server on VMware](https://docs.github.com/en/enterprise/admin/installation/installing-github-enterprise-server-on-vmware#hardware-considerations).

## Before you begin

GitHub Enterprise Server requires a valid license key. You may sign up for a [trial license](https://enterprise.github.com/trial). If you're looking to extend the capabilities of GitHub Enterprise Server via an integration, you may qualify for a free five-seat developer license. Apply for this license through [GitHub's Partner Program](https://partner.github.com/).

## Installing GitHub Enterprise Server on VMware

Download [the current release of GitHub Enterprise Server](https://enterprise.github.com/releases/2.19.0/download) for VMware ESXi/vSphere (OVA) and [deploy the OVA template](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc/GUID-17BEDA21-43F6-41F4-8FB2-E01D275FE9B4.html) you downloaded.

:::image type="content" source="media/github-enterprise-server/github-options.png" alt-text="Choose to run GitHub on premises or in the cloud.":::	

:::image type="content" source="media/github-enterprise-server/deploy-ova-template.png" alt-text="Deploy the OVA template.":::	

Provide a recognizable name for your new virtual machine, such as GitHubEnterpriseServer. You don't need to include the release details in the VM name, as these details become stale when the instance is upgraded. Select all the defaults for now (we'll edit these details shortly) and wait for the OVA to be imported.

Once imported, [adjust the hardware configuration](https://docs.github.com/en/enterprise/admin/installation/installing-github-enterprise-server-on-vmware#creating-the-github-enterprise-server-instance) based on your needs. In our example scenario, we'll need the following configuration.

| Resource | Standard Setup | Standard Set up + "Beta Features" (Actions) |
| --- | --- | --- |
| vCPUs | 4 | 8 |
| Memory | 32 GB | 61 GB |
| Attached storage | 250 GB | 300 GB |
| Root storage | 200 GB | 200 GB |

However, your needs may vary. Refer to the guidance on hardware considerations in [Installing GitHub Enterprise Server on VMware](https://docs.github.com/en/enterprise/admin/installation/installing-github-enterprise-server-on-vmware#hardware-considerations). Also see [Adding CPU or memory resources for VMware](https://docs.github.com/en/enterprise/admin/enterprise-management/increasing-cpu-or-memory-resources#adding-cpu-or-memory-resources-for-vmware) to customize the hardware configuration based on your situation.

## Configuring the GitHub Enterprise Server instance

:::image type="content" source="media/github-enterprise-server/install-github-enterprise.png" alt-text="Install GitHub Enterprise.":::	

After the newly provisioned virtual machine (VM) has powered on, [configure it via your browser](https://docs.github.com/en/enterprise/admin/installation/installing-github-enterprise-server-on-vmware#configuring-the-github-enterprise-server-instance). You'll be required to upload your license file and set a management console password. Be sure to write down this password somewhere safe.

:::image type="content" source="media/github-enterprise-server/ssh-access.png" alt-text="Access the admin shell via SSH.":::	

We recommend to at least take the following steps:

1. Upload a public SSH key to the management console, so that you can [access the administrative shell via SSH](https://docs.github.com/en/enterprise/admin/configuration/accessing-the-administrative-shell-ssh). 

2. [Configure TLS on your instance](https://docs.github.com/en/enterprise/admin/configuration/configuring-tls) so that you can use a certificate signed by a trusted certificate authority.

:::image type="content" source="media/github-enterprise-server/configuring-your-instance.png" alt-text="Configuring your instance.":::

Apply your settings.  While the instance restarts, you can continue with the next step, **Configuring Blob Storage for GitHub Actions**.

:::image type="content" source="media/github-enterprise-server/create-admin-account.png" alt-text="Create your admin account.":::

After the instance restarts, you can create a new admin account on the instance. Be sure to make a note of this user's password as well.

### Other configuration steps

To harden your instance for production use, the following optional setup steps are recommended:

1. Configure [high availability](https://help.github.com/enterprise/admin/guides/installation/configuring-github-enterprise-for-high-availability/) for protection against:

    - Software crashes (OS or application level)
    - Hardware failures (storage, CPU, RAM, and so on)
    - Virtualization host system failures
    - Logically or physically severed network

2. [Configure](https://docs.github.com/en/enterprise/admin/configuration/configuring-backups-on-your-appliance) [backup-utilities](https://github.com/github/backup-utils), providing versioned snapshots for disaster recovery, hosted in availability that is separate from the primary instance.
3. [Setup subdomain isolation](https://docs.github.com/en/enterprise/admin/configuration/enabling-subdomain-isolation), using a valid TLS certificate, to mitigate cross-site scripting and other related vulnerabilities.

## Configuring blob storage for GitHub Actions

> [!NOTE]
> GitHub Actions is [currently available as a limited beta on GitHub Enterprise Server release 2.22](https://docs.github.com/en/enterprise/admin/github-actions).

External blob storage is necessary to enable GitHub Actions on GitHub Enterprise Server (currently available as a "beta" feature). This external blob storage is used by Actions to store artifacts and logs. Actions on GitHub Enterprise Server [supports Azure Blob Storage as a storage provider](https://docs.github.com/en/enterprise/admin/github-actions/enabling-github-actions-and-configuring-storage#about-external-storage-requirements) (and some others). So we'll provision a new Azure storage account with a [storage account type](../storage/common/storage-account-overview.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#types-of-storage-accounts) of BlobStorage:

:::image type="content" source="media/github-enterprise-server/storage-account.png" alt-text="Provision Azure Blob Storage account.":::

Once the deployment of the new BlobStorage resource has completed, copy and make a note of the connection string (available under Access keys). We'll need this string shortly.

## Setting up the GitHub Actions runner

> [!NOTE]
> GitHub Actions is [currently available as a limited beta on GitHub Enterprise Server release 2.22](https://docs.github.com/en/enterprise/admin/github-actions).

At this point, you should have an instance of GitHub Enterprise Server running, with an administrator account created. You should also have external blob storage that GitHub Actions will use for persistence.

Now let's create somewhere for GitHub Actions to run; again, we'll use Azure VMware Solution.

First, let's provision a new VM on the cluster. We'll base our VM on [a recent release of Ubuntu Server](http://releases.ubuntu.com/20.04.1/).

:::image type="content" source="media/github-enterprise-server/provision-new-vm.png" alt-text="Provision a new VM.":::

:::image type="content" source="media/github-enterprise-server/provision-new-vm-2.png" alt-text="Provision a new VM step 2.":::

Once the VM is created, power it up and connect to it via SSH.

Next, install [the Actions runner](https://github.com/actions/runner) application, which runs a job from a GitHub Actions workflow. Identify and download the most current Linux x64 release of the Actions runner, either from [the releases page](https://github.com/actions/runner/releases) or by running the following quick script. This script requires both curl and [jq](https://stedolan.github.io/jq/) to be present on your VM.

`LATEST\_RELEASE\_ASSET\_URL=$( curl https://api.github.com/repos/actions/runner/releases/latest | \`

`  jq -r '.assets | .[] | select(.name | match("actions-runner-linux-arm64")) | .url' )`

`DOWNLOAD\_URL=$( curl $LATEST\_RELEASE\_ASSET\_URL | \`

`  jq -r '.browser\_download\_url' )`

`curl -OL $DOWNLOAD\_URL`

You should now have a file locally on your VM, actions-runner-linux-arm64-\*.tar.gz. Extract this tarball locally:

`tar xzf actions-runner-linux-arm64-\*.tar.gz`

This extraction unpacks a few files locally, including a `config.sh` and `run.sh` script, which we'll come back to shortly.

## Enabling GitHub Actions

> [!NOTE]
> GitHub Actions is [currently available as a limited beta on GitHub Enterprise Server release 2.22](https://docs.github.com/en/enterprise/admin/github-actions).

Nearly there! Let's configure and enable GitHub Actions on the GitHub Enterprise Server instance. We'll need to [access the GitHub Enterprise Server instance's administrative shell over SSH](https://docs.github.com/en/enterprise/admin/configuration/accessing-the-administrative-shell-ssh), and then run the following commands:

`# set an environment variable containing your Blob storage connection string`

`export CONNECTION\_STRING="<your connection string from the blob storage step>"`

`# configure actions storage`

`ghe-config secrets.actions.storage.blob-provider azure`

`ghe-config secrets.actions.storage.azure.connection-string "$CONNECTION\_STRING"`

`# apply these settings`

`ghe-config-apply`

`# execute a precheck, this install additional software required by Actions on GitHub Enterprise Server`

`ghe-actions-precheck -p azure -cs "$CONNECTION\_STRING"`

`# enable actions, and re-apply the config`

`ghe-config app.actions.enabled true`

`ghe-config-apply`

Next run:

`ghe-actions-check -s blob`

You should see output: "Blob Storage is healthy".

Now that GitHub Actions is configured, enable it for your users. Sign in to your GitHub Enterprise Server instance as an administrator, and select the ![Rocket icon.](media/github-enterprise-server/rocket-icon.png) in the upper right corner of any page. In the left sidebar, select **Enterprise overview**, then **Policies**, **Actions**, and select the option to **enable Actions for all organizations**.

Next, configure your runner from the **Self-hosted runners** tab. Select **Add new** and then **New runner** from the drop-down.

On the next page, you'll be presented with a set of commands to run, we just need to copy the command to **configure** the runner, for instance:

`./config.sh --url https://10.1.1.26/enterprises/octo-org --token AAAAAA5RHF34QLYBDCHWLJC7L73MA`

Copy the `config.sh` command and paste it into a session on your Actions runner (created previously).

:::image type="content" source="media/github-enterprise-server/actions-runner.png" alt-text="Actions runner.":::

Use the run.sh command to *run* the runner:

:::image type="content" source="media/github-enterprise-server/run-runner.png" alt-text="Run the runner.":::

To make this runner available to organizations in your enterprise, edit its organization access:

:::image type="content" source="media/github-enterprise-server/edit-runner-access.png" alt-text="Edit runner access.":::

Here we'll make it available to all organizations, but you can limit access to a subset of organizations, and even to specific repositories.

## (Optional) Configuring GitHub Connect

Although this step is optional, we recommend it if you plan to consume open-source actions available on GitHub.com. It allows you to build on the work of others by referencing these reusable actions in your workflows.

To enable GitHub Connect, follow the steps in [Enabling automatic access to GitHub.com actions using GitHub Connect](https://docs.github.com/en/enterprise/admin/github-actions/enabling-automatic-access-to-githubcom-actions-using-github-connect).

Once GitHub Connect is enabled, select the **Server to use actions from GitHub.com in workflow runs** option.

:::image type="content" source="media/github-enterprise-server/enable-using-actions.png" alt-text="Enable using actions from GitHub.com in workflow runs.":::

## Setting up and running your first workflow

Now that Actions and GitHub Connect is set up, let's put all this work to good use. Here's an example workflow that references the excellent [octokit/request-action](https://github.com/octokit/request-action), allowing us to "script" GitHub through interactions using the GitHub API, powered by GitHub Actions.

In this basic workflow, we'll use `octokit/request-action` to just open an issue on GitHub using the API.

:::image type="content" source="media/github-enterprise-server/workflow-example.png" alt-text="Example workflow.":::

>[!NOTE]
>GitHub.com hosts the action, but when it runs on GitHub Enterprise Server, it *automatically* uses the GitHub Enterprise Server API.

If you chose to not enable GitHub Connect, you can use the following alternative workflow.

:::image type="content" source="media/github-enterprise-server/workflow-example-2.png" alt-text="Alternative example workflow.":::

Navigate to a repo on your instance, and add the above workflow as: `.github/workflows/hello-world.yml`

:::image type="content" source="media/github-enterprise-server/workflow-example-3.png" alt-text="Another example workflow.":::

In the **Actions** tab for your repo, wait for the workflow to execute.

:::image type="content" source="media/github-enterprise-server/executed-example-workflow.png" alt-text="Executed example workflow.":::

You can also watch it being processed by the runner.

:::image type="content" source="media/github-enterprise-server/workflow-processed-by-runner.png" alt-text="Workflow processed by runner.":::

If everything ran successfully, you should see a new issue in your repo, entitled "Hello world."

:::image type="content" source="media/github-enterprise-server/example-in-repo.png" alt-text="Example in repo.":::

Congratulations! You just completed your first Actions workflow on GitHub Enterprise Server, running on your Azure VMware Solution private cloud.

In this article, we set up a new instance of GitHub Enterprise Server, the self-hosted equivalent of GitHub.com, on top of your Azure VMware Solution private cloud. This instance includes support for GitHub Actions and uses Azure Blob Storage for persistence of logs and artifacts. But we're just scratching the surface of what you can do with GitHub Actions. Check out the list of Actions on [GitHub's Marketplace](https://github.com/marketplace), or [create your own](https://docs.github.com/en/actions/creating-actions).

## Next steps

Now that you've covered setting up GitHub Enterprise Server on your Azure VMware Solution private cloud, you may want to learn about: 

- [How to get started with GitHub Actions](https://docs.github.com/en/actions)
- [How to join the beta program](https://resources.github.com/beta-signup/)
- [Administration of GitHub Enterprise Server](https://githubtraining.github.io/admin-training/#/00_getting_started)
