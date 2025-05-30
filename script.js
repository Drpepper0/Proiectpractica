
const supabaseUrl = 'https://wkelpjfyztrbhoxvwjhf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZWxwamZ5enRyYmhveHZ3amhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMzIzNTcsImV4cCI6MjA2MzkwODM1N30.j5T3DshUtJ21QCNtp6-AZdQoISEpzPkXEoZ15-CjgrM';  // Replace with your actual key
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// === UI ===
function toggleForm(editCar = null) {
  const formContainer = document.getElementById('car-form-container');
  const form = document.getElementById('car-form');
  const title = document.getElementById('form-title');
  form.reset();
  form.id.value = '';
  title.innerText = 'Add a Car';

  if (editCar) {
    form.id.value = editCar.id;
    form.brand.value = editCar.brand;
    form.model.value = editCar.model;
    form.Year.value = editCar.Year;
    form.Price.value = editCar.Price;
    form.daily_rate.value = editCar.daily_rate;
    form.Image_url.value = editCar.Image_url;
    form.is_avalible.checked = editCar.is_avalible;
    title.innerText = 'Edit Car';
  }

  formContainer.classList.toggle('hidden');
}

// === Load Cars ===
async function loadCars() {
  const { data, error } = await supabase.from('cars').select('*');
  if (error) {
    alert('Error loading cars: ' + error.message);
    return;
  }

  const container = document.getElementById('car-list');
  container.innerHTML = '';
  data.forEach(car => {
    container.innerHTML += `
      <div class="bg-white shadow rounded p-4 relative">
        <img src="${car.Image_url || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${car.brand}" class="w-full h-40 object-cover rounded mb-2">
        <h3 class="text-xl font-bold">${car.brand} ${car.model}</h3>
        <p class="text-gray-600">Year: ${car.Year}</p>
        <p class="text-gray-800 font-semibold">Price: €${car.Price}</p>
        <p class="text-gray-800">Daily Rate: €${car.daily_rate}</p>
        <p class="mt-1">
          ${car.is_avalible ? '<span class="text-green-600 font-semibold">Available</span>' : '<span class="text-red-600 font-semibold">Not Available</span>'}
        </p>
        <div class="mt-3 flex justify-end space-x-2">
          <button onclick='editCar(${JSON.stringify(car)})' class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
          <button onclick='deleteCar(${car.id})' class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
        </div>
      </div>
    `;
  });
}

// === Save Car (Create or Update) ===
document.getElementById('car-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const carData = {
    brand: form.brand.value,
    model: form.model.value,
    Year: parseInt(form.Year.value),
    Price: parseFloat(form.Price.value),
    daily_rate: parseFloat(form.daily_rate.value),
    Image_url: form.Image_url.value || null,
    is_avalible: form.is_avalible.checked ? 1 : 0
  };

  const carId = form.id.value;

  let result;
  if (carId) {
    // Update
    result = await supabase.from('cars').update(carData).eq('id', carId);
  } else {
    // Insert
    result = await supabase.from('cars').insert(carData);
  }

  if (result.error) {
    alert('Error saving car: ' + result.error.message);
    return;
  }

  toggleForm();
  loadCars();
});

// === Edit Car Handler ===
function editCar(car) {
  toggleForm(car);
}

// === Delete Car ===
async function deleteCar(id) {
  if (!confirm("Are you sure you want to delete this car?")) return;
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) {
    alert('Error deleting car: ' + error.message);
    return;
  }
  loadCars();
}

// Initial Load
loadCars();