<template>
  <section class="page-section" aria-labelledby="titulo-edit-sponsor">
    <b-container>
      <HeaderPage title="Editar Patrocinador" titleId="titulo-edit-sponsor" />
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <SponsorForm v-if="sponsor" :sponsor="sponsor" :animals="animals" @submit="update">
            <button type="submit" class="btn btn-outline-success btn-lg mr-2">
              <i class="fas fa-save" aria-hidden="true"></i> GUARDAR
            </button>
            <router-link
              :to="{name: 'listSponsors'}"
              tag="button"
              class="btn btn-outline-danger btn-lg"
            >
              <i class="fas fa-window-close" aria-hidden="true"></i> CANCELAR
            </router-link>
          </SponsorForm>
          <p v-else>A carregar...</p>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { FETCH_SPONSORS, EDIT_SPONSOR } from "@/store/sponsors/sponsor.constants";
import { FETCH_ANIMALS } from "@/store/animals/animal.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import SponsorForm from "@/components/SponsorForm.vue";
import { mapGetters } from "vuex";

export default {
  name: "EditSponsor",
  components: { HeaderPage, SponsorForm },
  data: () => {
    return { sponsor: null };
  },
  computed: {
    ...mapGetters("animal", ["getAnimals"]),
    ...mapGetters("sponsor", ["getSponsorsById", "getMessage"]),
    animals() {
      return this.getAnimals;
    }
  },
  methods: {
    // Cópia de trabalho: a API devolve os animais populados, o formulário usa os ids
    load() {
      const stored = this.getSponsorsById(this.$route.params.sponsorId);
      if (!stored) {
        this.$alert("Patrocinador não encontrado.", "Erro", "error");
        this.$router.push({ name: "listSponsors" });
        return;
      }
      this.sponsor = {
        ...stored,
        website: stored.website || "",
        logo: stored.logo || "",
        description: stored.description || "",
        type: stored.type || "",
        since: stored.since ? stored.since.substring(0, 10) : "",
        animals: stored.animals.map(animal => animal._id)
      };
    },
    update() {
      this.$store.dispatch(`sponsor/${EDIT_SPONSOR}`, this.sponsor).then(
        () => {
          this.$alert(this.getMessage, "Patrocinador atualizado!", "success");
          this.$router.push({ name: "listSponsors" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  },
  created() {
    // Os dados são pedidos sempre, para sobreviver a um refresh da página
    Promise.all([
      this.$store.dispatch(`animal/${FETCH_ANIMALS}`),
      this.$store.dispatch(`sponsor/${FETCH_SPONSORS}`)
    ]).then(
      () => this.load(),
      err => {
        this.$alert(`${err.message}`, "Erro", "error");
      }
    );
  }
};
</script>
