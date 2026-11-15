<template>
  <section aria-labelledby="animal-especialistas">
    <h3 id="animal-especialistas" class="h4 mt-4">Especialistas</h3>
    <p v-if="error" class="text-muted">Não foi possível carregar os dados.</p>
    <p v-else-if="loaded && items.length === 0" class="text-muted">Sem especialistas associados.</p>
    <ul v-else class="list-unstyled">
      <li v-for="item in items" :key="item._id" class="media mb-3">
        <img
          v-if="item.photo"
          :src="item.photo"
          :alt="'Fotografia de ' + item.name"
          class="mr-3 rounded"
          width="64"
          height="64"
        />
        <div class="media-body">
          <strong>{{item.name}}</strong>
          <div>{{[item.title, item.institution].filter(Boolean).join(' · ')}}</div>
          <a
            v-if="item.website"
            :href="item.website"
            target="_blank"
            rel="noopener noreferrer"
          >Website</a>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import expertService from "@/api/expert.service";

export default {
  name: "AnimalExperts",
  props: {
    animalId: { type: String, required: true }
  },
  data() {
    return { items: [], loaded: false, error: false };
  },
  created() {
    // Falha em silêncio: a página do animal continua a funcionar sem esta secção
    expertService.getExpertsByAnimal(this.$store.state.auth.token, this.animalId).then(
      res => {
        this.items = res.body;
        this.loaded = true;
      },
      () => {
        this.error = true;
      }
    );
  }
};
</script>
