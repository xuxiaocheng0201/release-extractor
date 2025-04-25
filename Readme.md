# Release Extractor Action

Use Regex to test Git commit message,
and determine whether the action needs to be executed.

## Example

```yml
name: Build Release

permissions:
  contents: read

on: [push]

jobs:
  check-version:
    name: Check version
    runs-on: ubuntu-latest
    steps:
      - uses: xuxiaocheng0201/release-extractor@v1.2.1
        id: check-version
        with:
          regex: "Release v(?<version>[0-9]\\.[0-9]\\.[0-9])"
          group: 'version'
    outputs:
      released: ${{ steps.check-version.outputs.matched }}
      version: ${{ steps.check-version.outputs.values }}
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: check-version
    if: needs.check-version.outputs.released == 'true'
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      # other steps to build
```

# Another choice
```yml
jobs:
  check-version:
    name: Check version
    runs-on: ubuntu-latest
    steps:
      - name: Extra version
        id: check-version
        shell: python
        run: |
          import re
          import os
          match = re.search(pattern="Release ([0-9]+\\.[0-9]+\\.[0-9]+)", string=os.getenv('message'))
          with open(os.getenv('GITHUB_OUTPUT'), "w") as f:
            if not match:
              f.write('matched=false\n')
            else:
              version = match.group(1)
              f.write('matched=true\n')
              f.write(f'values={version}\n')
        env:
          message: ${{ github.event.head_commit.message }}
    outputs:
      released: ${{ steps.check-version.outputs.matched }}
      version: ${{ steps.check-version.outputs.values }}
```
