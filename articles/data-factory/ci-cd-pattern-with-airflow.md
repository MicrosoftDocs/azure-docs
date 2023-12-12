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

Azure Data Factory's Managed Airflow service is a simple and efficient way to create and manage Apache Airflow environments, enabling you to run data pipelines at scale with ease. There are two primary methods to run directed acyclic graphs (DAGs) in Azure Managed Airflow. You can either upload the DAG files in your blob storage and link it with the Airflow environment or you can use the Git-sync feature to automatically sync your DAG-based Git repository with the Airflow environment. 

Working with data pipelines requires you to create or update your DAGs, plugins and requirement files frequently, based upon your workflow needs. While Airflow developers can manually create or update their DAG files in blob storage, many organizations prefer to use a CI/CD approach for code deployment. Therefore, this guide walks you through the recommended deployment patterns to seamlessly integrate and deploy your Apache Airflow DAGs with the Azure Managed Airflow service. 

## Understanding CI/CD 

### Continuous Integration (CI) 

Continuous Integration (CI) is a software development practice that emphasizes frequent and automated integration of code changes into a shared repository. It involves developers regularly committing their code, and upon each commit, an automated CI pipeline builds the code, runs tests, and performs validation checks. The primary goal is to detect and address integration issues early in the development process, providing rapid feedback to developers. CI ensures that the codebase remains in a constantly testable and deployable state. This leads to enhanced code quality, collaboration, and the ability to catch and fix bugs before they become significant problems. 

### Continuous Deployment 

Continuous Deployment (CD) is an extension of CI that takes the automation one step further. While CI focuses on automating the integration and testing phases, CD automates the deployment of code changes to production or other target environments. This practice enables organizations to release software updates rapidly and reliably, reducing manual deployment errors and ensuring that tested and approved code changes are swiftly delivered to end-users. 

### CI/CD Workflow Within Azure Managed Airflow: 
:::image type="content" source="media/ci-cd-with-airflow/ci-cd-workflow-airflow.png" alt-text="Screenshot showing ci cd pattern that can be used in Managed Airflow." lightbox="media/ci-cd-with-airflow/ci-cd-workflow-airflow.png":::

#### Git-sync with Dev IR: Map your Managed Airflow environment with your Git repository’s Dev branch. 

**CI Pipeline with Dev IR:** 

When a pull request (PR) is made from a feature branch to the Dev branch, it triggers a PR pipeline. This pipeline is designed to efficiently perform quality checks on your feature branches, ensuring code integrity and reliability. The following types of checks can be included in the pipeline: 
- **Python Dependencies Testing**: These tests install and verify the correctness of Python dependencies to ensure that the project's dependencies are properly configured. 
- **Code Analysis and Linting:** Tools for static code analysis and linting are applied to evaluate code quality and adherence to coding standards. 
- **Airflow DAG’s Tests:** These tests execute validation tests, including tests for the DAG definition and unit tests designed for Airflow DAGs. 
- **Unit Tests for Airflow custom operators, hooks, sensors and triggers**  
If any of these checks fail, the pipeline terminates, signaling that the developer needs to address the issues identified. 

#### Git-sync with Prod IR: Map your Managed Airflow environment with your Git repository’s Production branch. 

**PR pipeline with Prod IR:** 

It's considered a best practice to maintain a separate production environment to prevent every development feature from becoming publicly accessible. 
Once the Feature branch successfully merges with the Dev branch, you can create a pull request to the production branch in order to make your newly merged feature public. triggers a PR pipeline. This pull request triggers the PR pipeline that conducts rapid quality checks on the development branch to ensure that all features have been integrated correctly and that there are no errors in the production environment.

### Benefits of using CI/CD workflow in Managed Airflow 

It allows you to continuously deploy the DAGs/ code into Managed Airflow environment.  

- **Fail-fast approach:** Without the integration of CI/CD process, the first time you know DAG contains errors is likely when it's pushed to GitHub, synchronized with managed airflow and throws an Import Error. Meanwhile the other developer can unknowingly pull the faulty code from the repository, potentially leading to inefficiencies down the line. 

- **Code quality improvement:** Neglecting fundamental checks like syntax verification, necessary imports, and checks for other best coding practices, can increase the likelihood of delivering subpar code. 

## Deployment Patterns in Azure Managed Airflow: 

### Pattern 1: Develop data pipelines directly on Managed Airflow. 

### Prerequisites: 

- **Azure subscription:** If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Create or select an existing Data Factory in the region where the managed airflow preview is supported. 

- **Access to GitHub Repository:** [https://github.com/join](https://github.com/join) 

### Advantages: 

- **No Local Development Environment Required:** Managed Airflow handles the underlying infrastructure, updates, and maintenance, reducing the operational overhead of managing Airflow clusters. The service allows you to focus on building and managing workflows rather than managing infrastructure. 

- **Scalability:** Managed Airflow provides auto scaling capability to scale resources as needed, ensuring that your data pipelines can handle increasing workloads or bursts of activity without manual intervention. 

- **Monitoring and Logging:** Managed Airflow includes Diagnostic logs and monitoring, making it easier to track the execution of your workflows, diagnose issues, and optimize performance. 

- **Git Integration**: Managed Airflow supports Git-sync feature, allowing you to store your DAGs in Git repository, making it easier to manage changes and collaborate with the team.  

### Workflow: 

1. **Leverage Git-sync feature:** 

In this workflow, there's no requirement for you to establish your own local environment. Instead, you can start by using the Git-sync feature offered by the Managed Airflow service. This feature automatically synchronizes your DAG files with Airflow webservers, schedulers, and workers, allowing you to develop, test, and execute your data pipelines directly through the Managed Airflow UI. 

Learn more about how to use Azure Managed Airflow's [Git-sync feature](airflow-sync-github-repository.md).

2. **Individual Feature branch Environment:** 

You can choose the branch from your repository to sync with Azure Managed Airflow. This capability lets you create individual Airflow Environment for each feature branch, allowing developers to work on specific tasks for data pipelines. 

3. **Create a Pull Request:** 

Proceed to submit a Pull Request (PR) to the Airflow Development Environment (DEV IR), once you have thoroughly developed and tested your features within your dedicated Airflow Environment.

### Pattern 2: Develop DAGs Locally and Deploy on Managed Airflow

### Prerequisites: 

- GitHub Repository: [https://github.com/join](https://github.com/join) 

- Ensure that at least a single branch of your code repository is synchronized with the Managed Airflow to see the code changes on the service. 

### Advantages: 

**Limited Access:** Not every developer needs to have access to Azure resources. You can limit access to Azure resources to admin only. 

### Workflow: 

- **Local Environment Setup** 

Begin by setting up a local development environment for Apache Airflow on your development machine. In this environment, you can develop and test your Airflow code, including DAGs and tasks. This approach allows you to develop pipelines without relying on direct access to Azure resources.

- **Leverage Git-sync feature:** 

Synchronize your GitHub repository’s branch with Azure Managed Airflow Service. 

Learn more about how to use Azure Managed Airflow's [Git-sync feature](airflow-sync-github-repository.md).

- **Utilize Managed Airflow Service as Production environment:** 

You can raise a Pull Request (PR) to the branch that is sync with the Managed Airflow Service after successfully developing and testing data pipelines on local development setup. Once the branch is merged you can utilize the Managed Airflow service's features like auto-scaling and monitoring and logging at production level. 

### Sample CI/CD Pipeline using [GitHub Actions](https://github.com/features/actions).

**Step 1:** Copy the code for sample DAG deployed in Managed Airflow IR.
```python
from datetime import datetime 
from airflow import DAG 
from airflow.operators.bash import BashOperator 

with DAG( 
    dag_id="airflow-ci-cd-tutorial", 
    start_date=datetime(2023, 8, 15), 
    schedule="0 0 * * *", 
    tags=["tutorial", "CI/CD"] 
) as dag: 
    # Tasks are represented as operators 
    task1 = BashOperator(task_id="hello", bash_command="echo task1") 
    task2 = BashOperator(task_id="task2", bash_command="echo task2") 
    task3 = BashOperator(task_id="task3", bash_command="echo task3") 
    task4 = BashOperator(task_id="task4", bash_command="echo task4") 

    # Set dependencies between tasks 
    task1 >> task2 >> task3 >> task4 
```

**Step 2:** Create a `.github/workflows` directory in your GitHub repository. 

**Step 3:** In the `.github/workflows` directory, create a file named `ci-cd-demo.yml` 

**Step 4:** Copy the code for CI/CD Pipeline with GitHub Actions: The pipeline triggers whenever there's pull request or push request to dev branch:
```python
name: Test DAGs 

on: 
  pull_request: 
    branches: 
      - "dev" 
  push: 
    branches: 
      - "dev"

jobs: 
  flake8: 
    strategy: 
      matrix: 
        python-version: [3.11.5] 
    runs-on: ubuntu-latest 
    steps: 
      - name: Check out source repository 
        uses: actions/checkout@v4 
      - name: Setup Python 
        uses: actions/setup-python@v4 
        with: 
          python-version: ${{matrix.python-version}} 
      - name: flake8 Lint 
        uses: py-actions/flake8@v1 
        with: 
          max-line-length: 120  
  tests: 
    strategy: 
      matrix: 
        python-version: [3.11.5] 
    runs-on: ubuntu-latest 
    needs: [flake8] 
    steps: 
      - uses: actions/checkout@v4 
      - name: Setup Python 
        uses: actions/setup-python@v4 
        with: 
          python-version: ${{matrix.python-version}} 
      - name: Install dependencies 
        run: | 
          python -m pip install --upgrade pip 
          pip install -r requirements.txt 
      - name: Pytest 
        run: pytest tests/
```

**Step 5:** In the tests folder, create the tests for Airflow DAGs. Following are the few examples: 

* At the least, it's crucial to conduct initial testing using `import_errors` to ensure the DAG's integrity and correctness.   
This test ensures: 

- **Your DAG does not contain cyclicity:** Cyclicity, where a task forms a loop or circular dependency within  the workflow, can lead to unexpected and infinite execution loops. 

- **There are no import errors:** Import errors can arise due to issues like missing dependencies, incorrect module paths, or coding errors.  

- **Tasks are defined correctly:** Confirm that the tasks within your DAG are correctly defined.

```python
@pytest.fixture() 

def dagbag(): 
    return DagBag(dag_folder="dags") 

def test_no_import_errors(dagbag): 
    """ 
    Test Dags to contain no import errors. 
    """ 
    assert not dagbag.import_errors 
```

* Test to ensure specific Dag IDs to be present in your feature branch before merging it into the development (dev) branch. 

```python
def test_expected_dags(dagbag): 
    """ 
    Test whether expected dag Ids are present.
    """ 
    expected_dag_ids = ["airflow-ci-cd-tutorial"] 

    for dag_id in expected_dag_ids: 
        dag = dagbag.get_dag(dag_id) 

        assert dag is not None 
        assert dag_id == dag.dag_id 
```

* Test to ensure only approved tags are associated with your DAGs. This test helps to enforce the approved tag usage. 

```python
def test_requires_approved_tag(dagbag): 
    """ 
    Test if DAGS contain one or more tags from list of approved tags only. 
    """ 
    Expected_tags = {"tutorial", "CI/CD"} 
    dagIds = dagbag.dag_ids 

    for id in dagIds: 
        dag = dagbag.get_dag(id) 
        assert dag.tags 
        if Expected_tags: 
            assert not set(dag.tags) - Expected_tags 
```

**Step 6:** Now, when you raise pull request to dev branch, GitHub Actions triggers the CI pipeline, to run all the tests. 

#### For More Information: 

- [https://airflow.apache.org/docs/apache-airflow/stable/_modules/airflow/models/dagbag.html](https://airflow.apache.org/docs/apache-airflow/stable/_modules/airflow/models/dagbag.html) 

- https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html#unit-tests 

