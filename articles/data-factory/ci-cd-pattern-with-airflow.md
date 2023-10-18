---
title: CI/CD Patterns with Azure Managed Airflow
description: This document talks about recommended deployment patterns with Azure Managed Airflow
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.service: data-factory
ms.topic: how-to
ms.date: 10/17/2023
---

# CI/CD Patterns with Azure Managed Airflow

Azure Data Factory's Managed Airflow service is a simple and efficient way to create and manage Apache Airflow environments, enabling you to run data pipelines at scale with ease. To run directed acyclic graphs (DAGs), within Azure Managed Airflow, you can either upload the DAG files in your blob storage and link it with the Airflow environment or you can leverage the Git-sync feature to automatically synchronize your DAG-based Git repository with the Airflow environment.  

Working with data pipelines requires you to create or update your DAGs, plugins and requirement files frequently, based upon your workflow needs. Therefore, this guide will walk you through the recommended deployment patterns to seamlessly integrate or deploy your Apache Airflow DAGs with the Azure Managed Airflow service. 

Although Airflow developers can manually create or update their DAGs files in blob storage, most organizations prefer to use a continuous integration and continuous delivery approach to release code to their environments. 

## Understanding CI/CD 

### Continuous Integration (CI) 

Continuous Integration (CI) is a software development practice that emphasizes frequent and automated integration of code changes into a shared repository. It involves developers regularly committing their code, and upon each commit, an automated CI pipeline builds the code, runs tests, and performs validation checks. The primary goal is to detect and address integration issues early in the development process, providing rapid feedback to developers. CI ensures that the codebase remains in a constantly testable and deployable state, enhancing code quality, collaboration, and the ability to catch and fix bugs before they become significant problems. 

### Continuous Deployment 

Continuous Deployment (CD) is an extension of CI that takes the automation one step further. While CI focuses on automating the integration and testing phases, CD automates the deployment of code changes to production or other target environments. This practice enables organizations to release software updates rapidly and reliably, reducing manual deployment errors and ensuring that tested and approved code changes are swiftly delivered to end-users. 

## CI/CD Workflow Within Azure Managed Airflow: 

#### Git-sync with Dev IR: Map your Managed Airflow environment with your Git repository’s Dev branch. 

**CI Pipeline with Dev IR:** When a pull request (PR) is made from a feature branch to the Dev branch, it triggers a PR pipeline. This pipeline is designed to efficiently perform quality checks on your feature branches, ensuring code integrity and reliability. The following types of checks can be included in the pipeline: 

**Python Dependencies Testing**: These tests install and verify the correctness of Python dependencies to ensure that the project's dependencies are properly configured. 

**Code Analysis and Linting:** Tools for static code analysis and linting are applied to evaluate code quality and adherence to coding standards. 

**Airflow DAG’s Tests:** These tests execute validation tests, including tests for the DAG definition and unit tests specifically designed for Airflow DAGs. 

**Unit Tests for Airflow custom operators, hooks, sensors and triggerers**  

If any of these checks fail, the pipeline terminates, signaling that the developer needs to address the issues identified. 

#### Git-sync with Prod IR: Map your Managed Airflow environment with your Git repository’s Prod branch. 

**PR pipeline with Prod IR:** 

It is considered a best practice to maintain a separate production environment to prevent every development feature from becoming publicly accessible. 

Once the Feature branch successfully merges with the Dev branch, you may create a pull request to the prod branch in order to make your newly merged feature public. triggers a PR pipeline.  

This pull request will trigger a PR pipeline that conducts rapid quality checks on the development branch, ensuring that all features have been integrated correctly and that there are no errors in the production environment.

### Benefits of using CI/CD workflow in Managed Airflow 

It allows you to continuously deploy the DAGs/ code into Managed Airflow environment.  

1. **Fail-fast approach:**   

Without the integration of CI/CD process, the first time you know DAG contains errors is likely when it is pushed to GitHub, synchronized with managed airflow and throws an Import Error. Meanwhile the other developer may unknowingly pull the faulty code from the repository, potentially leading to inefficiencies down the line. 

2. **Code quality improvement:**  

Neglecting fundamental checks like syntax verification, necessary imports, and checks for other best coding practices, can increase the likelihood of delivering subpar code. 

## Deployment Patterns in Azure Managed Airflow: 

### Pattern 1: Develop data pipelines directly on Managed Airflow. 

### Prerequisites: 

1. **Azure subscription:** If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Create or select an existing Data Factory in the region where the managed airflow preview is supported. 

2. **Access to GitHub Repository:** [https://github.com/join](https://github.com/join) 

### Advantages: 

1. **No Local Development Environment Needed:** Managed Airflow handles the underlying infrastructure, updates, and maintenance, reducing the operational overhead of managing Airflow clusters. This allows you to focus on building and managing workflows rather than managing infrastructure. 

2. **Scalability:** Managed Airflow provides the ability to scale resources as needed, ensuring that your data pipelines can handle increasing workloads or bursts of activity without manual intervention. 

3. **Monitoring and Logging:** Managed Airflow includes Diagnostic logs and monitoring, making it easier to track the execution of your workflows, diagnose issues, and optimize performance. 

4. **Git Integration**: Managed Airflow supports Git-sync feature, allowing you to store your DAGs in Git repository, making it easier to manage changes and collaborate with the team.  

### Workflow: 

1. **Leverage Git-sync feature:** 

In this workflow, you don’t need to create your own local environment. Begin by utilizing the Git-sync feature provided by the Managed Airflow service. This features auto-sync your DAG’s files with Airflow webservers, schedulers and workers. This enables you to develop, test and execute your data pipelines directly on Managed Airflow UI. 

To learn more about how to use Git-sync, refer to document: https://learn.microsoft.com/en-us/azure/data-factory/airflow-sync-github-repository 

2. **Individual Feature branch Environment:** 

In Managed Airflow service, you can specify the branch name of your repository that you want to synchronize with it. Leveraging this feature, you can create a separate Airflow Environment for every feature branch, where a developer can work on specific features or tasks as per data pipeline requirement.  

3. **Create a** **Pull Request:** 

After successfully developing and testing your features within your individual Integration Runtime raise a Pull Request (PR) to the Dev Integration Runtime (DEV (development) IR). 

### Pattern 2: Develop DAGs Locally and Deploy on Managed Airflow

### Prerequisites: 

1. **GitHub Repository**: [https://github.com/join](https://github.com/join) 

2. Ensure that at least a single branch of your code repository is synchronized with the Managed Airflow to see the code changes on the service. 

### Advantages: 

**Limited Access:** Not every developer needs to have access to Azure resources. You can limit access to Azure resources to admin only. 

### Workflow: 

1. **Local Environment Setup** 

Begin by setting up a local environment for Apache Airflow on your development machine. Develop and test your Airflow code, including DAGs and tasks, within your local environment. This allows you to develop pipelines without relying on direct access to Azure resources. 

2. **Leverage Git-sync feature:** 

Synchronize your GitHub repository’s branch with Azure Managed Airflow Service. 

To learn more about how to use Git-sync, refer to document: https://learn.microsoft.com/en-us/azure/data-factory/airflow-sync-github-repository 

3. **Utilize Managed Airflow Service as Production environment:** 

After successfully developing and testing data pipelines on local development setup, developers can raise a Pull Request (PR) to the branch that is synchronized with the Managed Airflow Service. This enables developers to leverage the auto scaling feature, monitoring and logging features of Managed Airflow at production level. 

### Sample CI/CD Pipeline using GitHub Actions.

**Step 1:** Copy the code for sample DAG deployed in Managed Airflow IR.

**Step 2:** Create a `.github/workflows` directory in your GitHub repository. 

**Step 3:** In the .github/workflows directory, create a file named `ci-cd-demo.yml` 

**Step 4:** Below is the code for CI/CD Pipeline with GitHub Actions for Airflow: This pipeline triggers whenever there is pull request or push request to dev branch:

**Step 5:** In the tests folder, create the tests for Airflow DAGs. Following are the few examples: 

1. At the very least, it is crucial to conduct initial testing using `"import_errors`” to ensure the DAG's integrity and correctness.   
This test ensures: 

- **Your DAG does not contain cyclicity:** Cyclicity, where a task forms a loop or circular dependency within  the workflow, can lead to unexpected and infinite execution loops. 

- **There are no import errors:** Import errors can arise due to issues like missing dependencies, incorrect module paths, or coding errors.  

- **Tasks are defined correctly:** Confirm that the tasks within your DAG are correctly defined. 

1. Test to ensure specific Dag IDs to be present in your feature branch before merging it into the development (dev) branch. 

2. Test to ensure only approved tags are associated with your DAGs. This helps to enforce the approved tag usage. 

**Step 6:** Now, when you raise pull request to dev branch, GitHub Actions will trigger our CI pipeline, to run all the tests. 

#### For information: 

1. [https://airflow.apache.org/docs/apache-airflow/stable/_modules/airflow/models/dagbag.html](https://airflow.apache.org/docs/apache-airflow/stable/_modules/airflow/models/dagbag.html) 

2. https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html#unit-tests 

