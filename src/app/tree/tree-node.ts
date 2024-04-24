interface Coordenada {
    x: number;
    y: string;
    z: number;
}

export interface TreeNode {
    coordenada: Coordenada;
    marcado: boolean;
    hijo?: TreeNode[];
}