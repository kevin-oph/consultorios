import pandas as pd
import json
import os

# El archivo Excel está en la misma carpeta scripts
excel_file = 'Reporte_Base de datos SIGMA ZAPATA.xlsx'

# Cargar el archivo Excel
df = pd.read_excel(excel_file, sheet_name='conceptos')

# Limpieza básica: rellenar vacíos y convertir TODAS las columnas a texto plano (string)
df = df.fillna('NO CAPTURADO')
for col in df.columns:
    df[col] = df[col].astype(str).str.strip()

# Formatear columnas específicas si es necesario
df['COLONIA'] = df['COLONIA'].str.title()
df['MUNICIPIO'] = df['MUNICIPIO'].str.title()

# Convertir a formato de lista de diccionarios
records = df.to_dict(orient='records')

# Ruta de salida hacia public/data de tu proyecto React (subiendo un nivel desde scripts)
output_path = '../dashboard-consultorios/public/data/datos_consultorios.json'
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Guardar el archivo JSON
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(records, f, ensure_ascii=False, indent=2)

print(f"¡Exportados {len(records)} registros exitosamente a {output_path}!")