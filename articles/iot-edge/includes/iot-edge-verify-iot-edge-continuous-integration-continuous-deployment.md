---
author: v-tcassi
ms.service: iot-edge
ms.topic: include
ms.date: 12/23/2022
ms.author: v-tcassi
---

## Verify IoT Edge CI/CD with the build and release pipelines

To trigger a build job, you can either push a commit to source code repository or manually trigger it. In this section, you manually trigger the CI/CD pipeline to test that it works. Then verify that the deployment succeeds.

1. From the left pane menu, select **Pipelines** and open the build pipeline that you created at the beginning of this article.

2. You can trigger a build job in your build pipeline by selecting the **Run pipeline** button in the top right.

    ![Manually trigger your build pipeline using the Run pipeline button](media/iot-edge-verify-iot-edge-continuous-integration-continuous-deployment/manual-trigger.png)

3. Review the **Run pipeline** settings. Then, select **Run**.

    ![Specify run pipeline options and select Run](media/iot-edge-verify-iot-edge-continuous-integration-continuous-deployment/run-pipeline-settings.png)

4. Select **Agent job 1** to watch the run's progress. You can review the logs of the job's output by selecting the job. 

    ![Review the job's log output](media/iot-edge-verify-iot-edge-continuous-integration-continuous-deployment/view-job-run.png)

5. If the build pipeline is completed successfully, it triggers a release to **dev** stage. The successful **dev** release creates IoT Edge deployment to target IoT Edge devices.

    ![Release to dev](media/iot-edge-verify-iot-edge-continuous-integration-continuous-deployment/pending-approval.png)

6. Click **dev** stage to see release logs.

    ![Release logs](media/iot-edge-verify-iot-edge-continuous-integration-continuous-deployment/release-logs.png)

7. If your pipeline is failing, start by looking at the logs. You can view logs by navigating to the pipeline run summary and selecting the job and task. If a certain task is failing, check the logs for that task. For detailed instructions for configuring and using logs, see [Review logs to diagnose pipeline issues](/azure/devops/pipelines/troubleshooting/review-logs).
