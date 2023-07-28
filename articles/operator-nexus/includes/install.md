---
ms.custom: devx-track-azurecli
---
```bash

#!/bin/bash
set -e

function create_secret() {
  kubectl apply -f - -n "${NAMESPACE}" <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: naks-vm-telemetry
type: Opaque
stringData:
  SUBSCRIPTION_ID: "${SUBSCRIPTION_ID}"
  SERVICE_PRINCIPAL_ID: "${SERVICE_PRINCIPAL_ID}"
  SERVICE_PRINCIPAL_SECRET: "${SERVICE_PRINCIPAL_SECRET}"
  RESOURCE_GROUP: "${RESOURCE_GROUP}"
  TENANT_ID: "${TENANT_ID}"
  LOCATION: "${LOCATION}"
  PROXY_URL: "${PROXY_URL}"
  INSTALL_AZURE_MONITOR_AGENT: "${INSTALL_AZURE_MONITOR_AGENT}"
EOF
}

function create_daemonset() {
  kubectl apply -f - -n "${NAMESPACE}" <<EOF
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: naks-vm-telemetry
  labels:
    k8s-app: naks-vm-telemetry
spec:
  selector:
    matchLabels:
      name: naks-vm-telemetry
  template:
    metadata:
      labels:
        name: naks-vm-telemetry
    spec:
      hostNetwork: true
      hostPID: true
      containers:
        - name: naks-vm-telemetry
          image: mcr.microsoft.com/oss/mirror/docker.io/library/ubuntu:20.04
          env:
            - name: SUBSCRIPTION_ID
              valueFrom:
                secretKeyRef:
                  name: naks-vm-telemetry
                  key: SUBSCRIPTION_ID
            - name: SERVICE_PRINCIPAL_ID
              valueFrom:
                secretKeyRef:
                  name: naks-vm-telemetry
                  key: SERVICE_PRINCIPAL_ID
            - name: SERVICE_PRINCIPAL_SECRET
              valueFrom:
                secretKeyRef:
                  name: naks-vm-telemetry
                  key: SERVICE_PRINCIPAL_SECRET
            - name: RESOURCE_GROUP
              valueFrom:
                secretKeyRef:
                  name: naks-vm-telemetry
                  key: RESOURCE_GROUP
            - name: TENANT_ID
              valueFrom:
                secretKeyRef:
                  name: naks-vm-telemetry
                  key: TENANT_ID
            - name: LOCATION
              valueFrom:
                secretKeyRef:
                  name: naks-vm-telemetry
                  key: LOCATION
            - name: PROXY_URL
              valueFrom:
                secretKeyRef:
                  name: naks-vm-telemetry
                  key: PROXY_URL
            - name: INSTALL_AZURE_MONITOR_AGENT
              valueFrom:
                secretKeyRef:
                  name: naks-vm-telemetry
                  key: INSTALL_AZURE_MONITOR_AGENT
          securityContext:
            privileged: true
          command:
            - /bin/bash
            - -c
            - |
              set -e
              WORKDIR=\$(nsenter -t1 -m -u -n -i mktemp -d)
              trap 'nsenter -t1 -m -u -n -i rm -rf "\${WORKDIR}"; echo "Azure Monitor Configuration Failed"' ERR
              nsenter -t1 -m -u -n -i mkdir -p "\${WORKDIR}"/telemetry

              nsenter -t1 -m -u -n -i tee "\${WORKDIR}"/telemetry/telemetry_common.py > /dev/null <<EOF
              #!/usr/bin/python3
              import json
              import logging
              import os
              import socket
              import subprocess
              import sys

              arc_config_file = "\${WORKDIR}/telemetry/arc-connect.json"


              class AgentryResult:
                  CONNECTED = "Connected"
                  CREATING = "Creating"
                  DISCONNECTED = "Disconnected"
                  FAILED = "Failed"
                  SUCCEEDED = "Succeeded"


              class OnboardingMessage:
                  COMPLETED = "Onboarding completed"
                  STILL_CREATING = "Azure still creating"
                  STILL_TRYING = "Service still trying"


              def get_logger(logger_name):
                  logger = logging.getLogger(logger_name)
                  logger.setLevel(logging.DEBUG)
                  handler = logging.StreamHandler(stream=sys.stdout)
                  format = logging.Formatter(fmt="%(name)s - %(levelname)s - %(message)s")
                  handler.setFormatter(format)
                  logger.addHandler(handler)
                  return logger


              def az_cli_cm_ext_install(logger, config):
                  logger.info("Install az CLI connectedmachine extension")
                  proxy_url = config.get("PROXY_URL")
                  if proxy_url is not None:
                      os.environ["HTTP_PROXY"] = proxy_url
                      os.environ["HTTPS_PROXY"] = proxy_url
                  run_cmd(logger, "/usr/bin/az extension add --name connectedmachine --yes")


              def get_cm_properties(logger, config):
                  hostname = socket.gethostname()
                  resource_group = config.get("RESOURCE_GROUP")

                  logger.info(f"Getting arc enrollment properties for {hostname}...")

                  az_login(logger, config)

                  property_cmd = f'/usr/bin/az connectedmachine show --machine-name "{hostname}" --resource-group "{resource_group}"'

                  try:
                      raw_property = run_cmd(logger, property_cmd)
                      cm_json = json.loads(raw_property.stdout)
                      provisioning_state = cm_json["properties"]["provisioningState"]
                      status = cm_json["properties"]["status"]
                  except:
                      logger.warning("Connectedmachine not yet present")
                      provisioning_state = "NOT_PROVISIONED"
                      status = "NOT_CONNECTED"
                  finally:
                      az_logout(logger)

                  logger.info(
                      f'Connected machine "{hostname}" provisioningState is "{provisioning_state}" and status is "{status}"'
                  )

                  return provisioning_state, status


              def get_cm_extension_state(logger, config, extension_name):
                  resource_group = config.get("RESOURCE_GROUP")
                  hostname = socket.gethostname()

                  logger.info(f"Getting {extension_name} state for {hostname}...")

                  az_login(logger, config)

                  state_cmd = f'/usr/bin/az connectedmachine extension show --name "{extension_name}" --machine-name "{hostname}" --resource-group "{resource_group}"'

                  try:
                      raw_state = run_cmd(logger, state_cmd)
                      cme_json = json.loads(raw_state.stdout)
                      provisioning_state = cme_json["properties"]["provisioningState"]
                  except:
                      logger.warning("Connectedmachine extension not yet present")
                      provisioning_state = "NOT_PROVISIONED"
                  finally:
                      az_logout(logger)

                  logger.info(
                      f'Connected machine "{hostname}" extenstion "{extension_name}" provisioningState is "{provisioning_state}"'
                  )

                  return provisioning_state


              def run_cmd(logger, cmd, check_result=True, echo_output=True):
                  res = subprocess.run(
                      cmd,
                      shell=True,
                      stdout=subprocess.PIPE,
                      stderr=subprocess.PIPE,
                      universal_newlines=True,
                  )

                  if res.stdout:
                      if echo_output:
                          logger.info(f"[OUT] {res.stdout}")

                  if res.stderr:
                      if echo_output:
                          logger.info(f"[ERR] {res.stderr}")

                  if check_result:
                      res.check_returncode()

                  return res  # can parse out res.stdout and res.returncode


              def az_login(logger, config):
                  logger.info("Login to Azure account...")
                  proxy_url = config.get("PROXY_URL")
                  if proxy_url is not None:
                      os.environ["HTTP_PROXY"] = proxy_url
                      os.environ["HTTPS_PROXY"] = proxy_url

                  service_principal_id = config.get("SERVICE_PRINCIPAL_ID")
                  service_principal_secret = config.get("SERVICE_PRINCIPAL_SECRET")
                  tenant_id = config.get("TENANT_ID")
                  subscription_id = config.get("SUBSCRIPTION_ID")
                  cmd = f'/usr/bin/az login --service-principal --username "{service_principal_id}" --password "{service_principal_secret}" --tenant "{tenant_id}"'
                  run_cmd(logger, cmd)
                  logger.info(f"Set Subscription...{subscription_id}")
                  set_sub = f'/usr/bin/az account set --subscription "{subscription_id}"'
                  run_cmd(logger, set_sub)


              def az_logout(logger):
                  logger.info("Logout of Azure account...")
                  run_cmd(logger, "/usr/bin/az logout --verbose", check_result=False)

              EOF

              nsenter -t1 -m -u -n -i tee "\${WORKDIR}"/telemetry/setup_arc_for_servers.py > /dev/null <<EOF
              #!/usr/bin/python3
              import json
              import time

              import telemetry_common


              def run_connect(logger, arc_config):
                  logger.info("Connect machine to Azure Arc...")
                  service_principal_id = arc_config.get("SERVICE_PRINCIPAL_ID")
                  service_principal_secret = arc_config.get("SERVICE_PRINCIPAL_SECRET")
                  resource_group = arc_config.get("RESOURCE_GROUP")
                  tenant_id = arc_config.get("TENANT_ID")
                  subscription_id = arc_config.get("SUBSCRIPTION_ID")
                  location = arc_config.get("LOCATION")
                  connect_cmd = f'azcmagent connect --service-principal-id "{service_principal_id}" --service-principal-secret "{service_principal_secret}" --resource-group "{resource_group}" --tenant-id "{tenant_id}" --subscription-id "{subscription_id}" --location "{location}"'

                  cloudtype = arc_config.get("CLOUDTYPE")
                  if cloudtype is not None:
                      connect_cmd += f' --cloud "{cloudtype}"'

                  tags = arc_config.get("TAGS")
                  if tags is not None:
                      connect_cmd += f' --tags "{tags}"'

                  correlation_id = arc_config.get("CORRELATION_ID")
                  if correlation_id is not None:
                      connect_cmd += f' --correlation-id "{correlation_id}"'

                  proxy_url = arc_config.get("PROXY_URL")
                  if proxy_url is not None:
                      set_proxy_cmd = f'/usr/bin/azcmagent config set proxy.url "{proxy_url}"'
                      telemetry_common.run_cmd(logger, set_proxy_cmd)

                  # Hardcoding allowed extensions as these will only vary if NC team adds new extensions
                  allowed_extensions = "Microsoft.Azure.Monitor/AzureMonitorLinuxAgent,Microsoft.Azure.AzureDefenderForServers/MDE.Linux"
                  set_extensions_cmd = (
                      f'/usr/bin/azcmagent config set extensions.allowlist "{allowed_extensions}"'
                  )
                  telemetry_common.run_cmd(logger, set_extensions_cmd)

                  telemetry_common.az_login(logger, arc_config)
                  logger.info("Connecting machine to Azure Arc...")

                  try:
                      telemetry_common.run_cmd(logger, connect_cmd)
                  except:
                      logger.info("Trying to connect machine to Azure Arc...")
                  finally:
                      telemetry_common.az_logout(logger)


              def run_disconnect(logger, arc_config):
                  logger.info("Disconnect machine from Azure Arc...")
                  service_principal_id = arc_config.get("SERVICE_PRINCIPAL_ID")
                  service_principal_secret = arc_config.get("SERVICE_PRINCIPAL_SECRET")

                  cmd = f'/usr/bin/azcmagent disconnect --service-principal-id "{service_principal_id}" --service-principal-secret "{service_principal_secret}"'

                  telemetry_common.az_login(logger, arc_config)

                  try:
                      telemetry_common.run_cmd(logger, cmd)
                  except:
                      logger.info("Trying to disconnect machine from Azure Arc...")
                  finally:
                      telemetry_common.az_logout(logger)


              def arc_enrollment(logger, arc_config):
                  logger.info("Executing Arc enrollment...")

                  telemetry_common.az_cli_cm_ext_install(logger, arc_config)

                  # Get connected machine properties
                  cm_provisioning_state, cm_status = telemetry_common.get_cm_properties(
                      logger, arc_config
                  )

                  if (
                      cm_provisioning_state == telemetry_common.AgentryResult.SUCCEEDED
                      and cm_status == telemetry_common.AgentryResult.CONNECTED
                  ):
                      logger.info(telemetry_common.OnboardingMessage.COMPLETED)
                      return True
                  elif cm_provisioning_state in [
                      telemetry_common.AgentryResult.FAILED,
                      telemetry_common.AgentryResult.DISCONNECTED,
                  ]:
                      run_disconnect(logger, arc_config)
                      logger.warning(telemetry_common.OnboardingMessage.STILL_TRYING)
                      return False
                  elif cm_provisioning_state == telemetry_common.AgentryResult.CREATING:
                      logger.warning(telemetry_common.OnboardingMessage.STILL_CREATING)
                      return False
                  else:
                      run_connect(logger, arc_config)
                      logger.warning(telemetry_common.OnboardingMessage.STILL_TRYING)
                      return False


              def main():
                  timeout = 300  # TODO: increase when executed via systemd unit
                  start_time = time.time()
                  end_time = start_time + timeout

                  config_file = telemetry_common.arc_config_file

                  logger = telemetry_common.get_logger(__name__)

                  logger.info("Running setup_arc_for_servers.py...")

                  if config_file is None:
                      raise Exception("config file is expected")

                  arc_config = {}

                  with open(config_file, "r") as file:
                      arc_config = json.load(file)

                  arc_enrolled = False

                  while time.time() < end_time:
                      logger.info("Arc enrolling the server...")
                      try:
                          arc_enrolled = arc_enrollment(logger, arc_config)
                      except Exception as e:
                          logger.error(f"Could not arc enroll server: {e}")
                      if arc_enrolled:
                          break
                      logger.info("Sleeping 30s...")  # retry for Azure info
                      time.sleep(30)


              if __name__ == "__main__":
                  main()

              EOF

              nsenter -t1 -m -u -n -i tee "\${WORKDIR}"/telemetry/setup_azure_monitor_agent.py > /dev/null <<EOF
              #!/usr/bin/python3
              import json
              import os
              import socket
              import time

              import telemetry_common


              def run_install(logger, ama_config):
                  logger.info("Install Azure Monitor agent...")
                  resource_group = ama_config.get("RESOURCE_GROUP")
                  location = ama_config.get("LOCATION")
                  proxy_url = ama_config.get("PROXY_URL")
                  hostname = socket.gethostname()
                  if proxy_url is not None:
                      os.environ["HTTP_PROXY"] = proxy_url
                      os.environ["HTTPS_PROXY"] = proxy_url
                      settings = (
                          '{"proxy":{"mode":"application","address":"'
                          + proxy_url
                          + '","auth": "false"}}'
                      )
                      cmd = f'/usr/bin/az connectedmachine extension create --no-wait --name "AzureMonitorLinuxAgent" --publisher "Microsoft.Azure.Monitor" --type "AzureMonitorLinuxAgent" --machine-name "{hostname}" --resource-group "{resource_group}" --location "{location}" --verbose --settings \'{settings}\''
                  else:
                      cmd = f'/usr/bin/az connectedmachine extension create --no-wait --name "AzureMonitorLinuxAgent" --publisher "Microsoft.Azure.Monitor" --type "AzureMonitorLinuxAgent" --machine-name "{hostname}" --resource-group "{resource_group}" --location "{location}" --verbose'

                  version = ama_config.get("VERSION")
                  if version is not None:
                      cmd += f' --type-handler-version "{version}"'

                  logger.info("Installing Azure Monitor agent...")
                  telemetry_common.az_login(logger, ama_config)

                  try:
                      telemetry_common.run_cmd(logger, cmd)
                  except:
                      logger.info("Trying to install Azure Monitor agent...")
                  finally:
                      telemetry_common.az_logout(logger)


              def run_uninstall(logger, ama_config):
                  logger.info("Uninstall Azure Monitor agent...")
                  resource_group = ama_config.get("RESOURCE_GROUP")
                  hostname = socket.gethostname()
                  cmd = f'/usr/bin/az connectedmachine extension delete --name "AzureMonitorLinuxAgent" --machine-name "{hostname}" --resource-group "{resource_group}" --yes --verbose'

                  telemetry_common.az_login(logger, ama_config)
                  logger.info("Uninstalling Azure Monitor agent...")

                  try:
                      telemetry_common.run_cmd(logger, cmd)
                  except:
                      print("Trying to uninstall Azure Monitor agent...")
                  finally:
                      telemetry_common.az_logout(logger)


              def ama_installation(logger, ama_config):
                  logger.info("Executing AMA extenstion installation...")
                  telemetry_common.az_cli_cm_ext_install(logger, ama_config)

                  # Get connected machine properties
                  cm_provisioning_state, cm_status = telemetry_common.get_cm_properties(
                      logger, ama_config
                  )

                  if (
                      cm_provisioning_state == telemetry_common.AgentryResult.SUCCEEDED
                      and cm_status == telemetry_common.AgentryResult.CONNECTED
                  ):
                      # Get AzureMonitorLinuxAgent extension status
                      ext_provisioning_state = telemetry_common.get_cm_extension_state(
                          logger, ama_config, "AzureMonitorLinuxAgent"
                      )

                      if ext_provisioning_state == telemetry_common.AgentryResult.SUCCEEDED:
                          logger.info(telemetry_common.OnboardingMessage.COMPLETED)
                          return True
                      elif ext_provisioning_state == telemetry_common.AgentryResult.FAILED:
                          run_uninstall(logger, ama_config)
                          logger.warning(telemetry_common.OnboardingMessage.STILL_TRYING)
                          return False
                      elif ext_provisioning_state == telemetry_common.AgentryResult.CREATING:
                          logger.warning(telemetry_common.OnboardingMessage.STILL_CREATING)
                          return False
                      else:
                          run_install(logger, ama_config)
                          logger.warning(telemetry_common.OnboardingMessage.STILL_TRYING)
                          return False
                  else:
                      logger.error("Server not arc enrolled, enroll the server and retry")
                      return False


              def main():
                  timeout = 60  # TODO: increase when executed via systemd unit
                  start_time = time.time()
                  end_time = start_time + timeout

                  config_file = telemetry_common.arc_config_file

                  logger = telemetry_common.get_logger(__name__)

                  logger.info("Running setup_azure_monitor_agent.py...")

                  if config_file is None:
                      raise Exception("config file is expected")

                  ama_config = {}

                  with open(config_file, "r") as file:
                      ama_config = json.load(file)

                  ama_installed = False

                  while time.time() < end_time:
                      logger.info("Installing AMA extension...")
                      try:
                          ama_installed = ama_installation(logger, ama_config)
                      except Exception as e:
                          logger.error(f"Could not install AMA extension: {e}")
                      if ama_installed:
                          break
                      logger.info("Sleeping 30s...")  # retry for Azure info
                      time.sleep(30)


              if __name__ == "__main__":
                  main()

              EOF


              nsenter -t1 -m -u -n -i tee "\${WORKDIR}"/arc-connect.sh > /dev/null <<EOF
              #!/bin/bash
              set -e

              echo "{\"SUBSCRIPTION_ID\": \"\${SUBSCRIPTION_ID}\", \"SERVICE_PRINCIPAL_ID\": \"\${SERVICE_PRINCIPAL_ID}\", \"SERVICE_PRINCIPAL_SECRET\": \"\${SERVICE_PRINCIPAL_SECRET}\", \"RESOURCE_GROUP\": \"\${RESOURCE_GROUP}\", \"TENANT_ID\": \"\${TENANT_ID}\", \"LOCATION\": \"\${LOCATION}\", \"PROXY_URL\": \"\${PROXY_URL}\"}" > "\${WORKDIR}"/telemetry/arc-connect.json

              echo "Connecting machine to Azure Arc..."
              /usr/bin/python3 "\${WORKDIR}"/telemetry/setup_arc_for_servers.py > "\${WORKDIR}"/setup_arc_for_servers.out
              cat "\${WORKDIR}"/setup_arc_for_servers.out
              if grep "Could not arc enroll server" "\${WORKDIR}"/setup_arc_for_servers.out > /dev/null; then
                exit 1
              fi

              /usr/bin/azcmagent config set incomingconnections.ports 22
              /usr/bin/azcmagent config set extensions.allowlist Microsoft.Azure.Monitor/AzureMonitorLinuxAgent,Microsoft.Azure.AzureDefenderForServers/MDE.Linux,Microsoft.Azure.ActiveDirectory/AADSSHLoginForLinux

              if [ "\${INSTALL_AZURE_MONITOR_AGENT}" = "true" ]; then
                echo "Installing Azure Monitor agent..."
                /usr/bin/python3 "\${WORKDIR}"/telemetry/setup_azure_monitor_agent.py > "\${WORKDIR}"/setup_azure_monitor_agent.out
                cat "\${WORKDIR}"/setup_azure_monitor_agent.out
                if grep "Could not install AMA extension" "\${WORKDIR}"/setup_azure_monitor_agent.out > /dev/null; then
                  exit 1
                fi
              fi
              EOF

              nsenter -t1 -m -u -n -i sh "\${WORKDIR}"/arc-connect.sh
              nsenter -t1 -m -u -n -i rm -rf "\${WORKDIR}"
              echo "Server monitoring configured successfully"
              tail -f /dev/null
          livenessProbe:
            initialDelaySeconds: 600
            periodSeconds: 60
            timeoutSeconds: 30
            exec:
              command:
                - /bin/bash
                - -c
                - |
                  set -e
                  WORKDIR=\$(nsenter -t1 -m -u -n -i mktemp -d)
                  trap 'nsenter -t1 -m -u -n -i rm -rf "\${WORKDIR}"' ERR EXIT
                  nsenter -t1 -m -u -n -i tee "\${WORKDIR}"/liveness.sh > /dev/null <<EOF
                  #!/bin/bash
                  set -e

                  # Check AMA processes
                  ps -ef | grep "\\\s/opt/microsoft/azuremonitoragent/bin/agentlauncher\\\s"
                  ps -ef | grep "\\\s/opt/microsoft/azuremonitoragent/bin/mdsd\\\s"
                  ps -ef | grep "\\\s/opt/microsoft/azuremonitoragent/bin/amacoreagent\\\s"

                  # Check Arc server agent is Connected
                  AGENTSTATUS="\\\$(azcmagent show -j)"
                  if [[ \\\$(echo "\\\${AGENTSTATUS}" | jq -r .status) != "Connected" ]]; then
                    echo "azcmagent is not connected"
                    echo "\\\${AGENTSTATUS}"
                    exit 1
                  fi

                  # Verify dependent services are running
                  while IFS= read -r status; do
                    if [[ "\\\${status}" != "active" ]]; then
                      echo "one or more azcmagent services not active"
                      echo "\\\${AGENTSTATUS}"
                      exit 1
                    fi
                  done < <(jq -r '.services[] | (.status)' <<<\\\${AGENTSTATUS})

                  # Run connectivity tests
                  RESULT="\\\$(azcmagent check -j)"
                  while IFS= read -r reachable; do
                    if [[ ! \\\${reachable} ]]; then
                      echo "one or more connectivity tests failed"
                      echo "\\\${RESULT}"
                      exit 1
                    fi
                  done < <(jq -r '.[] | (.reachable)' <<<\\\${RESULT})

                  EOF

                  nsenter -t1 -m -u -n -i sh "\${WORKDIR}"/liveness.sh
                  nsenter -t1 -m -u -n -i rm -rf "\${WORKDIR}"
                  echo "Liveness check succeeded"

      tolerations:
        - operator: "Exists"
          effect: "NoSchedule"

EOF
}

SUBSCRIPTION_ID="${SUBSCRIPTION_ID:?SUBSCRIPTION_ID must be set}"
SERVICE_PRINCIPAL_ID="${SERVICE_PRINCIPAL_ID:?SERVICE_PRINCIPAL_ID must be set}"
SERVICE_PRINCIPAL_SECRET="${SERVICE_PRINCIPAL_SECRET:?SERVICE_PRINCIPAL_SECRET must be set}"
RESOURCE_GROUP="${RESOURCE_GROUP:?RESOURCE_GROUP must be set}"
TENANT_ID="${TENANT_ID:?TENANT_ID must be set}"
LOCATION="${LOCATION:?LOCATION must be set}"
PROXY_URL="${PROXY_URL:?PROXY_URL must be set}"
INSTALL_AZURE_MONITOR_AGENT="${INSTALL_AZURE_MONITOR_AGENT:?INSTALL_AZURE_MONITOR_AGENT must be true/false}"
NAMESPACE="${NAMESPACE:?NAMESPACE must be set}"

create_secret
create_daemonset
```
