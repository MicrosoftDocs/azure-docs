import os
import re

def ensure_ms_service_metadata(folder_path, service_name='azure-app-service'):
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Match YAML front matter block
                match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
                if match:
                    yaml_block = match.group(1)
                    if 'ms.service:' not in yaml_block:
                        updated_yaml = yaml_block + f'\nms.service: {service_name}'
                        updated_content = content.replace(match.group(0), f'---\n{updated_yaml}\n---')
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(updated_content)
                        print(f"Inserted ms.service into: {file_path}")

# Example usage
ensure_ms_service_metadata('.', 'azure-app-service')
