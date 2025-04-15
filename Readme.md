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
      - uses: xuxiaocheng0201/release-extractor@v1.2.0
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
    if: needs.check-version.outputs.released
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      # other steps to build
```
