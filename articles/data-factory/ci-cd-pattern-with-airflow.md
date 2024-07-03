---
title: CI/CD patterns with Workflow Orchestration Manager
description: This article talks about recommended deployment patterns with Workflow Orchestration Manager.
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.service: data-factory
ms.topic: how-to
ms.date: 10/17/2023
---

# CI/CD patterns with Workflow Orchestration Manager

> [!NOTE]
> Workflow Orchestration Manager is powered by Apache Airflow.

Workflow Orchestration Manager provides a simple and efficient way to create and manage Apache Airflow environments. The service enables you to run data pipelines at scale with ease. There are two primary methods to run DAGs in Workflow Orchestration Manager. You can upload the DAG files in your blob storage and link them with the Airflow environment. Alternatively, you can use the Git-sync feature to automatically sync your Git repository with the Airflow environment.

Working with data pipelines in Airflow requires you to create or update your DAGs, plugins, and requirement files frequently, based on your workflow needs. Although developers can manually upload or edit DAG files in blob storage, many organizations prefer to use a continuous integration and continuous delivery (CI/CD) approach for code deployment. This article walks you through the recommended deployment patterns to seamlessly integrate and deploy your Apache Airflow DAGs with Workflow Orchestration Manager.

## Understand CI/CD

### Continuous integration

Continuous integration is a software development practice that emphasizes frequent and automated integration of code changes into a shared repository. It involves developers regularly committing their code, and upon each commit, an automated CI pipeline builds the code, runs tests, and performs validation checks. The primary goals are to detect and address integration issues early in the development process and provide rapid feedback to developers.

CI ensures that the codebase remains in a constantly testable and deployable state. This practice leads to enhanced code quality, collaboration, and the ability to catch and fix bugs before they become significant problems.

### Continuous delivery

Continuous delivery is an extension of CI that takes the automation one step further. While CI focuses on automating the integration and testing phases, CD automates the deployment of code changes to production or other target environments. This practice helps organizations release software updates quickly and reliably. It reduces mistakes in manual deployment and ensures that approved code changes are delivered to users swiftly.

## CI/CD workflow within Workflow Orchestration Manager

:::image type="content" source="media/ci-cd-with-airflow/ci-cd-workflow-airflow.png" alt-text="Screenshot that shows the CI/CD pattern that can be used in Workflow Orchestration Manager." lightbox="media/ci-cd-with-airflow/ci-cd-workflow-airflow.png":::

### Git sync with Dev/QA integration runtime

Map your Workflow Orchestration Manager environment with your Git repository's development/QA branch.

#### CI pipeline with Dev/QA integration runtime

When a pull request (PR) is made from a feature branch to the development branch, it triggers a PR pipeline. This pipeline is designed to efficiently perform quality checks on your feature branches, ensuring code integrity and reliability. You can include the following types of checks in the pipeline:

- **Python dependencies testing:** These tests install and verify the correctness of Python dependencies to ensure that the project's dependencies are properly configured.
- **Code analysis and linting:** Tools for static code analysis and linting are applied to evaluate code quality and adherence to coding standards.
- **Airflow DAG tests:** These tests execute validation tests, including tests for the DAG definition and unit tests designed for Airflow DAGs.
- **Unit tests for Airflow custom operators, hooks, sensors, and triggers**

If any of these checks fail, the pipeline terminates. You then need to address the issues identified.

### Git sync with production integration runtime

Map your Workflow Orchestration Manager environment with your Git repository's production branch.

#### PR pipeline with production integration runtime

A best practice is to maintain a separate production environment to prevent every development feature from becoming publicly accessible.

After the feature branch successfully merges into the development branch, you can create a pull request to the production branch to make your newly merged feature public. This pull request triggers the PR pipeline that conducts rapid quality checks on the development branch. Quality checks ensure that all features were integrated correctly and there are no errors in the production environment.

### Benefits of using the CI/CD workflow in Workflow Orchestration Manager

- **Fail-fast approach:** Without the integration of the CI/CD process, the first time you know DAG contains errors is likely when it's pushed to GitHub, synchronized with Workflow Orchestration Manager, and throws an `Import Error`. Meanwhile, another developer can unknowingly pull the faulty code from the repository, which potentially leads to inefficiencies down the line.
- **Code quality improvement:** If you neglect fundamental checks like syntax verification, necessary imports, and checks for other best coding practices, you increase the likelihood of delivering subpar code.

## Deployment patterns in Workflow Orchestration Manager

We recommend two deployment patterns.

### Pattern 1: Develop data pipelines directly in Workflow Orchestration Manager

You can develop data pipelines directly in Workflow Orchestration Manager when you use pattern 1.

### Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Create or select an existing Data Factory instance in the region where the Workflow Orchestration Manager preview is supported.
- You need access to a [GitHub repository](https://github.com/join).

### Advantages

- **No local development environment required:** Workflow Orchestration Manager handles the underlying infrastructure, updates, and maintenance, reducing the operational overhead of managing Airflow clusters. The service allows you to focus on building and managing workflows rather than managing infrastructure.
- **Scalability:** Workflow Orchestration Manager provides autoscaling capability to scale resources as needed, ensuring that your data pipelines can handle increasing workloads or bursts of activity without manual intervention.
- **Monitoring and logging:** Workflow Orchestration Manager includes diagnostic logs and monitoring to help you track the execution of your workflows, diagnose issues, set up alerts, and optimize performance.

### Workflow

1. Use the Git-sync feature.

    In this workflow, there's no requirement to establish your own local environment. Instead, you can start by using the Git-sync feature offered by Workflow Orchestration Manager. This feature automatically synchronizes your DAG files with Airflow web servers, schedulers, and workers. Now you can develop, test, and execute your data pipelines directly through the Workflow Orchestration Manager UI.

    Learn more about how to use the Workflow Orchestration Manager [Git-sync feature](airflow-sync-github-repository.md).

1. Create individual feature branch environments.

    You can choose the branch from your repository to sync with Workflow Orchestration Manager. This capability lets you create an individual Airflow environment for each feature branch. In this way, developers can work on specific tasks for data pipelines.

1. Create a pull request.

    Proceed to submit a pull request to the Airflow development environment integration runtime after you thoroughly develop and test your features within your dedicated Airflow environment.

### Pattern 2: Develop DAGs locally and deploy on Workflow Orchestration Manager

You can develop DAGs locally and deploy them on Workflow Orchestration Manager when you use pattern 2.

### Prerequisites

- You need access to a [GitHub repository](https://github.com/join).
- Ensure that at least a single branch of your code repository is synchronized with Workflow Orchestration Manager to see the code changes on the service.

### Advantages

You can limit access to Azure resources to admins only.

### Workflow

1. Set up a local environment.

    Begin by setting up a local development environment for Apache Airflow on your development machine. In this environment, you can develop and test your Airflow code, including DAGs and tasks. This approach allows you to develop pipelines without relying on direct access to Azure resources.

1. Use the Git-sync feature.

    Synchronize your GitHub repository's branch with Workflow Orchestration Manager.

    Learn more about how to use the Workflow Orchestration Manager [Git-sync feature](airflow-sync-github-repository.md).

1. Use Workflow Orchestration Manager as a production environment.

    After you successfully develop and test data pipelines on your local setup, you can raise a pull request to the branch synchronized with Workflow Orchestration Manager. After the branch is merged, use Workflow Orchestration Manager features like autoscaling and monitoring and logging at the production level.

## Sample CI/CD pipeline

For more information, see:

- [Azure DevOps](https://azure.microsoft.com/products/devops)
- [GitHub actions](https://github.com/features/actions)

1. Copy the code of a DAG deployed in Workflow Orchestration Manager integration runtime by using the Git-sync feature.

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
        task1 = BashOperator(task_id="task1", bash_command="echo task1")
        task2 = BashOperator(task_id="task2", bash_command="echo task2")
        task3 = BashOperator(task_id="task3", bash_command="echo task3")
        task4 = BashOperator(task_id="task4", bash_command="echo task4")

        # Set dependencies between tasks
        task1 >> task2 >> task3 >> task4
    ```

1. Create a CI/CD pipeline. You have two options: Azure DevOps or GitHub actions.

    1. **Azure DevOps option**: Create the file `azure-devops-ci-cd.yaml` and copy the following code. The pipeline triggers on a pull request or push request to the development branch:

        ```python
        trigger:
        - dev

        pr:
        - dev

        pool:
          vmImage: ubuntu-latest
        strategy:
          matrix:
            Python3.11:
              python.version: '3.11.5'

        steps:
        - task: UsePythonVersion@0
          inputs:
            versionSpec: '$(python.version)'
          displayName: 'Use Python $(python.version)'

        - script: |
            python -m pip install --upgrade pip
            pip install -r requirements.txt
          displayName: 'Install dependencies'

        - script: |
            airflow webserver &
            airflow db init
            airflow scheduler &
            pytest
          displayName: 'Pytest'
        ```

        For more information, see [Azure Pipelines](/azure/devops/pipelines/get-started/pipelines-sign-up).



    1. **GitHub actions option**: Create a `.github/workflows` directory in your GitHub repository.

        1. In the `.github/workflows` directory, create a file named `github-actions-ci-cd.yml`.

        1. Copy the following code. The pipeline triggers whenever there's a pull request or push request to the development branch:

            ```python
            name: GitHub Actions CI/CD

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
                    run: |
                      airflow webserver &
                      airflow db init
                      airflow scheduler &
                      pytest tests/
            ```

1. In the tests folder, create the tests for Airflow DAGs. Here are a few examples:

    1. At the least, it's crucial to conduct initial testing by using `import_errors` to ensure the DAG's integrity and correctness. This test ensures:

        - **Your DAG doesn't contain cyclicity:** Cyclicity, where a task forms a loop or circular dependency within the workflow, can lead to unexpected and infinite execution loops.
        - **There are no import errors:** Import errors can arise because of issues like missing dependencies, incorrect module paths, or coding errors.  
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

    1. Test to ensure specific DAG IDs are present in your feature branch before merging them into the development branch.

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

    1. Test to ensure only approved tags is associated with your DAGs. This test helps to enforce the approved tag usage.

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

1. Now when you raise a pull request to the development branch, you can see that GitHub actions trigger the CI pipeline to run all the tests.

## Related content

- [Source code for airflow.models.dagbag](https://airflow.apache.org/docs/apache-airflow/stable/_modules/airflow/models/dagbag.html)
- [Apache Airflow unit tests](https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html#unit-tests)