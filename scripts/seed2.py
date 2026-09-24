import pandas as pd
import json
import os

# Archivo Excel de origen (asegúrate de que esté en la ruta correcta)
excel_file = 'Reporte_Base de datos SIGMA ZAPATA.xlsx'

print("Cargando archivo Excel...")
df = pd.read_excel(excel_file, sheet_name='conceptos')

# Rellenar vacíos
df = df.fillna('NO CAPTURADO')
for col in df.columns:
    df[col] = df[col].astype(str).str.strip()

# Función de limpieza profunda y normalización
def limpiar_colonia(val):
    if not val or val == 'NO CAPTURADO' or val.lower() == 'nan':
        return 'No Capturado Por Usuario'
    
    # Mayúsculas y quitar espacios dobles, comas o puntos finales
    v = val.upper().replace(',', '').replace('.', '').strip()
    v = " ".join(v.split()) # Quitar espacios intermedios dobles
    
    # Diccionario de homologación oficial hacia el padrón correcto
    if 'TESO' in v or 'TEZO' in v:
        return 'Tezoyuca'
    if 'TEPAT' in v or 'TEPET' in v:
        return 'Tepetzingo'
    if 'TETE' in v:
        return 'Tetecalita'
    if 'BENITO' in v:
        return 'Benito Juárez'
    if 'PRO' in v and 'HOGAR' in v:
        return 'Prohogar'
    if '3' in v and 'MAYO' in v:
        if 'AMPLI' in v:
            return 'Ampliación 3 de Mayo'
        return 'Tres de Mayo'
    if 'VILLA' in v and 'MORELOS' in v:
        if '1' in v or 'PRIMERA' in v:
            return '1ra. Sección Villa Morelos'
        if '2' in v or 'SEGUNDA' in v:
            return '2da. Sección Villa Morelos'
        return 'Villa Morelos'
    if 'CALVARIO' in v:
        return 'El Calvario'
    if 'CAPULIN' in v or 'CAPIRI' in v:
        return 'El Capulín'
    if 'ORGANO' in v:
        return 'El Órgano'
    if 'PASEOS' in v and 'RIO' in v:
        return 'Paseos del Río'
    if v == 'CENTRO' or 'CENTRO (' in v:
        return 'Centro (Emiliano Zapata)'
        
    # Si no cae en ninguna regla anterior, regresa el texto limpio con formato capitalizado
    return val.title()

print("Limpiando y normalizando colonias...")
df['COLONIA'] = df['COLONIA'].apply(limpiar_colonia)
df['MUNICIPIO'] = df['MUNICIPIO'].str.title()

# Convertir a registros
records = df.to_dict(orient='records')

# Ruta de salida exacta hacia tu proyecto React
output_path = '../dashboard-consultorios/public/data/datos_consultorios.json'
os.makedirs(os.path.dirname(output_path), exist_ok=True)

print(f"Guardando archivo JSON en {output_path}...")
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(records, f, ensure_ascii=False, indent=2)

print(f"¡Listo! Se exportaron {len(records)} registros completamente limpios.")