{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_20
    nodePackages.npm
    nodePackages.typescript
  ];

  shellHook = ''
    echo "Node.js $(node --version) ready"
    echo "npm $(npm --version) ready"
  '';
}

