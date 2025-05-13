const atomicWeights = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007, O: 15.999,
  F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974, S: 32.06,
  Cl: 35.45, Ar: 39.948, K: 39.098, Ca: 40.078, Fe: 55.845, Zn: 65.38, Cu: 63.546,
  Ag: 107.87, Au: 196.97, Sn: 118.71, Pb: 207.2, Hg: 200.59, I: 126.90
};

const elementNames = {
  hydrogen: "H", helium: "He", lithium: "Li", beryllium: "Be", boron: "B", carbon: "C",
  nitrogen: "N", oxygen: "O", fluorine: "F", neon: "Ne", sodium: "Na", magnesium: "Mg",
  aluminum: "Al", silicon: "Si", phosphorus: "P", sulfur: "S", chlorine: "Cl", argon: "Ar",
  potassium: "K", calcium: "Ca", iron: "Fe", zinc: "Zn", copper: "Cu", silver: "Ag",
  gold: "Au", tin: "Sn", lead: "Pb", mercury: "Hg", iodine: "I"
};

function normalizeFormula(input) {
  const lower = input.trim().toLowerCase();
  if (elementNames[lower]) return elementNames[lower]; // Name only
  return input.replace(/([a-zA-Z]+)(\d*)/g, (match, element, qty) => {
    if (element.length === 1) {
      return element.toUpperCase() + (qty || '');
    }
    return element[0].toUpperCase() + element.slice(1).toLowerCase() + (qty || '');
  });
}

function calculateMolarMass(input) {
  const formula = normalizeFormula(input);
  let total = 0, i = 0;
  const stack = [];

  while (i < formula.length) {
    if (formula[i] === '(') {
      stack.push(total);
      total = 0;
      i++;
    } else if (formula[i] === ')') {
      i++;
      let num = '';
      while (/\d/.test(formula[i])) num += formula[i++];
      total = (stack.pop() || 0) + total * parseInt(num || '1');
    } else if (/[A-Z]/.test(formula[i])) {
      let element = formula[i++];
      if (/[a-z]/.test(formula[i])) element += formula[i++];
      let qty = '';
      while (/\d/.test(formula[i])) qty += formula[i++];
      const count = parseInt(qty || '1');
      if (!atomicWeights[element]) {
        alert(`❌ Unknown element: ${element}`);
        return null;
      }
      total += atomicWeights[element] * count;
    } else {
      i++;
    }
  }

  return total;
}

function updateFields() {
  const op = document.getElementById('operation').value;
  document.getElementById('massField').style.display = op === 'gToMol' ? 'block' : 'none';
  document.getElementById('molesField').style.display = op === 'molToG' ? 'block' : 'none';
}

function runCalculation() {
  const formulaEl = document.getElementById('formula');
  const input = formulaEl.value.trim();
  const mass = parseFloat(document.getElementById('mass').value) || 0;
  const moles = parseFloat(document.getElementById('moles').value) || 0;
  const op = document.getElementById('operation').value;
  const results = document.getElementById('results');

  if (!input) {
    results.textContent = '⚠️ Please enter a chemical formula or element name.';
    formulaEl.classList.add('error');
    return;
  }

  const molarMass = calculateMolarMass(input);
  if (molarMass === null) return;

  const normalized = normalizeFormula(input);
  let output = `🧪 Molar Mass of ${normalized} = ${molarMass.toFixed(3)} g/mol\n`;

  if (op === 'gToMol') {
    output += `${mass} g ➜ ${(mass / molarMass).toFixed(4)} mol`;
  } else if (op === 'molToG') {
    output += `${moles} mol ➜ ${(moles * molarMass).toFixed(4)} g`;
  }

  results.textContent = output;
  formulaEl.classList.remove('error');
}

document.getElementById('operation').addEventListener('change', updateFields);
document.getElementById('calculate').addEventListener('click', runCalculation);
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    runCalculation();
  }
});
document.getElementById('results').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('results').textContent)
    .then(() => alert("📋 Copied result to clipboard!"));
});
updateFields();
