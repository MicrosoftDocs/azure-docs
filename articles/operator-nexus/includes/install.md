
```bash

#!/bin/bash
set -e

function create_secret() {
  kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: haks-vm-telemetry
type: Opaque
stringData:
  SUBSCRIPTION_ID: "${SUBSCRIPTION_ID}"
  SERVICE_PRINCIPAL_ID: "${SERVICE_PRINCIPAL_ID}"
  SERVICE_PRINCIPAL_SECRET: "${SERVICE_PRINCIPAL_SECRET}"
  RESOURCE_GROUP: "${RESOURCE_GROUP}"
  TENANT_ID: "${TENANT_ID}"
  LOCATION: "${LOCATION}"
EOF
}

function create_daemonset() {
  kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: haks-vm-telemetry
  namespace: default
  labels:
    k8s-app: haks-vm-telemetry
spec:
  selector:
    matchLabels:
      name: haks-vm-telemetry
  template:
    metadata:
      labels:
        name: haks-vm-telemetry
    spec:
      hostNetwork: true
      hostPID: true
      containers:
        - name: haks-vm-telemetry
          image: mcr.microsoft.com/oss/mirror/docker.io/library/ubuntu:20.04
          env:
            - name: SUBSCRIPTION_ID
              valueFrom:
                secretKeyRef:
                  name: haks-vm-telemetry
                  key: SUBSCRIPTION_ID
            - name: SERVICE_PRINCIPAL_ID
              valueFrom:
                secretKeyRef:
                  name: haks-vm-telemetry
                  key: SERVICE_PRINCIPAL_ID
            - name: SERVICE_PRINCIPAL_SECRET
              valueFrom:
                secretKeyRef:
                  name: haks-vm-telemetry
                  key: SERVICE_PRINCIPAL_SECRET
            - name: RESOURCE_GROUP
              valueFrom:
                secretKeyRef:
                  name: haks-vm-telemetry
                  key: RESOURCE_GROUP
            - name: TENANT_ID
              valueFrom:
                secretKeyRef:
                  name: haks-vm-telemetry
                  key: TENANT_ID
            - name: LOCATION
              valueFrom:
                secretKeyRef:
                  name: haks-vm-telemetry
                  key: LOCATION
          securityContext:
            privileged: true
          command:
            - /bin/bash
            - -c
            - |
              set -e
              WORKDIR=\$(nsenter -t1 -m -u -n -i mktemp -d)
              trap 'nsenter -t1 -m -u -n -i rm -rf "\${WORKDIR}"; echo "Azure Monitor Configuration Failed"' ERR
              nsenter -t1 -m -u -n -i cp -r /etc/telemetry/ "\${WORKDIR}"

              nsenter -t1 -m -u -n -i tee "\${WORKDIR}"/telemetry/telemetry_common.py > /dev/null <<EOF
              #!/usr/bin/python3
              import os
              import subprocess
              def run_cmd(cmd, check_result=True):
                  try:
                      res = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True, check=check_result)
                  except subprocess.CalledProcessError as e:
                      print(f'[OUT] {e.stdout}')
                      print(f'[ERR] {e.stderr}')
                  if res.stdout:
                      print(f'[OUT] {res.stdout}')
                  if res.stderr:
                      print(f'[ERR] {res.stderr}')
                  return res # can parse out res.stdout and res.returncode
              def az_login(config):
                  print('Login to Azure account...')
                  proxy_url = config.get('PROXY_URL')
                  os.environ["HTTP_PROXY"] = proxy_url
                  os.environ["HTTPS_PROXY"] = proxy_url
                  service_principal_id = config.get('SERVICE_PRINCIPAL_ID')
                  service_principal_secret = config.get('SERVICE_PRINCIPAL_SECRET')
                  tenant_id = config.get('TENANT_ID')
                  subscription_id = config.get('SUBSCRIPTION_ID')
                  cmd = f'az login --service-principal -u "{service_principal_id}" --password "{service_principal_secret}" --tenant "{tenant_id}"'
                  run_cmd(cmd)
                  print('Set Subscription ...', {subscription_id} )
                  set_sub = f'az account set --subscription "{subscription_id}"'
                  run_cmd(set_sub)
              def az_logout():
                  print('Logout of Azure account...')
                  run_cmd('az logout --verbose', check_result = False)
              EOF

              nsenter -t1 -m -u -n -i tee "\${WORKDIR}"/arc-connect.sh > /dev/null <<EOF
              #!/bin/bash
              set -e

              source /etc/environment
              PROXY_URL="\\\${https_proxy:-\\\${HTTPS_PROXY:-\\\${http_proxy:-\\\${HTTP_PROXY}}}}"
              echo "{\"SUBSCRIPTION_ID\": \"\${SUBSCRIPTION_ID}\", \"SERVICE_PRINCIPAL_ID\": \"\${SERVICE_PRINCIPAL_ID}\", \"SERVICE_PRINCIPAL_SECRET\": \"\${SERVICE_PRINCIPAL_SECRET}\", \"RESOURCE_GROUP\": \"\${RESOURCE_GROUP}\", \"TENANT_ID\": \"\${TENANT_ID}\", \"LOCATION\": \"\${LOCATION}\", \"PROXY_URL\": \"\\\${PROXY_URL}\"}" > "\${WORKDIR}"/arc-connect.json

              echo "Connecting machine to Azure Arc..."
              /usr/bin/python3 "\${WORKDIR}"/telemetry/setup_arc_for_servers.py --config-file "\${WORKDIR}"/arc-connect.json --connect > "\${WORKDIR}"/setup_arc_for_servers.out
              cat "\${WORKDIR}"/setup_arc_for_servers.out
              if grep "Failed to connect machine to Azure Arc" "\${WORKDIR}"/setup_arc_for_servers.out > /dev/null; then
                exit 1
              fi

              echo "Installing Azure Monitor agent..."
              /usr/bin/python3 "\${WORKDIR}"/telemetry/setup_azure_monitor_agent.py --config-file "\${WORKDIR}"/arc-connect.json --install > "\${WORKDIR}"/setup_azure_monitor_agent.out
              cat "\${WORKDIR}"/setup_azure_monitor_agent.out
              if grep "Failed to install Azure Monitor agent" "\${WORKDIR}"/setup_azure_monitor_agent.out > /dev/null; then
                exit 1
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

create_secret
create_daemonset
```
